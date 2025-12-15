import { omit } from 'lodash';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IAuthService } from './interface/auth.service.interface';
import { ICustomerService } from '@components/customer/interface/customer.service.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterRequestDto } from './dto/request/register.request.dto';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { ResponseBuilder } from '@utils/response-builder';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from '@databases/postgres/entities/account.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { LoginResponseDto } from './dto/response/login.response';
import { RefreshTokenEntity } from '@databases/postgres/entities/refresh-token.entity';

@Injectable()
export class AuthService implements IAuthService {
  private logger = new Logger();
  constructor(
    private readonly configService: ConfigService,

    private jwtService: JwtService,

    // @Inject(CacheService)
    // private cacheService: CacheService,

    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
    @Inject('ICustomerService')
    private customerService: ICustomerService,
  ) {}

  async login(request: any): Promise<any> {
    const { username, password } = request;

    const user = await this.accountRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('Invalid username or password');
    }

    const isPasswordValid = await this.__comparePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new NotFoundException('Invalid username or password');
    }

    const token = await this.__genToken(user.id.toString());
    let refreshTokenEntity = await this.refreshTokenRepository.findOne({
      where: { user },
    });

    const expiresAt = new Date(
      Date.now() +
        parseInt(this.configService.get<string>('JWT_REFRESH_TTL'), 10),
    );

    if (refreshTokenEntity) {
      refreshTokenEntity.tokenHash = await bcrypt.hash(token.refreshToken, 10);
      refreshTokenEntity.expiresAt = expiresAt;
      refreshTokenEntity.revoked = false;
      await this.refreshTokenRepository.save(refreshTokenEntity);
    } else {
      refreshTokenEntity = this.refreshTokenRepository.create({
        user,
        tokenHash: await bcrypt.hash(token.refreshToken, 10),
        expiresAt,
        revoked: false,
      });
      await this.refreshTokenRepository.save(refreshTokenEntity);
    }

    const response = plainToInstance(
      LoginResponseDto,
      { data: token },
      { excludeExtraneousValues: true },
    );

    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  async register(payload: RegisterRequestDto): Promise<any> {
    try {
      const isExist = await this.__existAccount(payload.username);
      if (isExist) {
        throw new NotFoundException('Username already exists');
      }

      const customerResp = await this.customerService.createCustomer(
        payload.customer,
      );

      const hashedPassword = await this.__hashPassword(payload.password);
      if (payload.role === 'ADMIN') {
        throw new BadRequestException('Cannot register with ADMIN role');
      }
      const AccountEntity = this.accountRepository.create({
        username: payload.username,
        password: hashedPassword,
        role: payload.role.toUpperCase(),
        customer: { id: customerResp?.data?.id },
      });
      await this.accountRepository.save(AccountEntity);

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage('Success')
        .build();
    } catch (error) {
      throw error;
    }
  }

  async verifyToken(request: any): Promise<any> {
    const customerInfo = request?.customer || {};
    if (!customerInfo?.id || !customerInfo?.token) {
      throw new NotFoundException();
    }

    const customerResponse = omit(customerInfo, ['iat', 'token']);
    if (customerInfo?.isFromCache) {
      return new ResponseBuilder(customerResponse)
        .withCode(ResponseCodeEnum.SUCCESS)
        .build();
    }

    const customer = await this.customerService.getCustomerById(
      customerInfo.id,
    );
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // await this.__cacheDataToken(request?.customer?.token, customerInfo);

    return new ResponseBuilder(customerResponse)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  async refreshToken(token: string): Promise<any> {
    if (!token) {
      throw new NotFoundException('Refresh token is required');
    }
    try {
      const tokenData = await this.jwtService.verify(token, {
        secret: `${this.configService.get('JWT_REFRESH_SECRET')}`,
      });
      if (!tokenData?.user?.id) {
        throw new NotFoundException('Invalid refresh token');
      }

      const data = await this.__genToken(tokenData?.user?.id);

      return new ResponseBuilder(data)
        .withCode(ResponseCodeEnum.SUCCESS)
        .build();
    } catch (error) {
      throw new NotFoundException('Invalid refresh token');
    }
  }

  private async __genToken(
    uid: string,
  ): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    const account = await this.accountRepository.findOne({
      where: { id: Number(uid) },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const jwtPayload = {
      user: {
        id: account.id,
        role: account.role,
        username: account.username,
      },
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload),
      this.jwtService.signAsync(jwtPayload, {
        secret: `${this.configService.get('JWT_REFRESH_SECRET')}`,
        expiresIn: `${this.configService.get('JWT_REFRESH_TTL')}`,
      }),
    ]);

    // await this.__cacheDataToken(accessToken, jwtPayload);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.configService.get('JWT_TTL'),
    };
  }

  private async __existAccount(username: string): Promise<boolean> {
    const account = await this.accountRepository.findOne({
      where: { username },
    });
    return !!account;
  }

  private async __hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private async __comparePassword(
    password: string,
    hashed: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashed);
  }
}

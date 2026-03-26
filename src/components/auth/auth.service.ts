import { IsNumber } from 'class-validator';
import { omit } from 'lodash';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IAuthService } from './interface/auth.service.interface';
import { IUserService } from '@components/user/interface/user.service.interface';
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
import { LoginRequestDto } from './dto/request/login.request.dto';
import { RegisterUserResponseDto } from './dto/response/register-user.response';
import { AccountRepository } from '@repositories/account.repository';
import { RefreshTokenRepository } from '@repositories/refresh-token.repository';

@Injectable()
export class AuthService implements IAuthService {
  private logger = new Logger();
  constructor(
    private readonly configService: ConfigService,

    private jwtService: JwtService,

    // @Inject(CacheService)
    // private cacheService: CacheService,

    @Inject('IAccountRepository')
    private readonly accountRepository: AccountRepository,
    @Inject('IRefreshTokenRepository')
    private readonly refreshTokenRepository: RefreshTokenRepository,
    @Inject('IUserService')
    private userService: IUserService,
  ) {}

  async login(request: LoginRequestDto): Promise<any> {
    const { email, password } = request;

    const account = await this.accountRepository.findOneByCondition({
      where: { email },
    });

    if (!account) {
      throw new NotFoundException('Invalid email or password');
    }

    const isPasswordValid = await this.__comparePassword(
      password,
      account.password,
    );

    if (!isPasswordValid) {
      throw new NotFoundException('Invalid email or password');
    }

    const token = await this.__genToken(account.id);

    let refreshTokenEntity =
      await this.refreshTokenRepository.findOneByCondition({
        where: { account: { id: account.id } },
      });

    const expiresAt = new Date(
      Date.now() +
        parseInt(this.configService.get<string>('JWT_REFRESH_TTL'), 10),
    );

    if (refreshTokenEntity) {
      refreshTokenEntity.tokenHash = await bcrypt.hash(token.refreshToken, 10);
      refreshTokenEntity.expiresAt = expiresAt;
      refreshTokenEntity.revoked = false;
      await this.refreshTokenRepository.update(refreshTokenEntity);
    } else {
      this.refreshTokenRepository.create({
        account,
        tokenHash: await bcrypt.hash(token.refreshToken, 10),
        expiresAt,
        revoked: false,
      });
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
      const isExist = await this.__existAccount(payload.email);
      if (isExist) {
        throw new NotFoundException('Email already exists');
      }

      const hashedPassword = await this.__hashPassword(payload.password);

      if (payload.role === 'ADMIN') {
        throw new BadRequestException('Cannot register with ADMIN role');
      }

      const AccountEntity = {
        username: payload.username,
        email: payload.email,
        password: hashedPassword,
        role: payload.role.toUpperCase(),
      };

      // payload.user.account = AccountEntity.id;

      // await this.userService.createUser(payload.user);

      await this.accountRepository.create(AccountEntity);

      const response = plainToInstance(RegisterUserResponseDto, {
        excludeExtraneousValues: true,
      });

      return new ResponseBuilder(response)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage('Success')
        .withData(response)
        .build();
    } catch (error) {
      throw error;
    }
  }

  async verifyToken(request: any): Promise<any> {
    const userInfo = request?.user || {};
    if (!userInfo?.id || !userInfo?.token) {
      throw new NotFoundException();
    }

    const userResponse = omit(userInfo, ['iat', 'token']);
    if (userInfo?.isFromCache) {
      return new ResponseBuilder(userResponse)
        .withCode(ResponseCodeEnum.SUCCESS)
        .build();
    }

    const user = await this.userService.getUserById(userInfo.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // await this.__cacheDataToken(request?.user?.token, userInfo);

    return new ResponseBuilder(userResponse)
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
    uid: number,
  ): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    const account = await this.accountRepository.findOneById(uid);
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

  private async __existAccount(email: string): Promise<boolean> {
    const account = await this.accountRepository.findOneByCondition({
      where: { email },
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

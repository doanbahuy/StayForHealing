import { omit } from 'lodash';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IAuthService } from './interface/auth.service.interface';
import { ICustomerService } from '@components/customer/interface/customer.service.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterCustomerRequestDto } from './dto/request/register-customer.request.dto';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { ResponseBuilder } from '@utils/response-builder';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthEntity } from '@databases/postgres/entities/auth.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { LoginResponseDto } from './dto/response/login.response';

@Injectable()
export class AuthService implements IAuthService {
  private logger = new Logger();
  constructor(
    private readonly configService: ConfigService,

    private jwtService: JwtService,

    // @Inject(CacheService)
    // private cacheService: CacheService,

    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,

    @Inject('ICustomerService')
    private customerService: ICustomerService,
  ) {}

  async login(request: any): Promise<any> {
    const { username, password } = request;
    const user = await this.authRepository.findOne({
      where: { username },
      relations: ['customer'],
    });
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
    const token = await this.__genToken(user?.customer?.id.toString());
    const response = plainToInstance(
      LoginResponseDto,
      { data: token },
      {
        excludeExtraneousValues: true,
      },
    );
    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  async registerCustomer(payload: RegisterCustomerRequestDto): Promise<any> {
    try {
      const customerResp = await this.customerService.createCustomer(
        payload.customer,
      );

      const hashedPassword = await this.__hashPassword(payload.password);
      const authEntity = this.authRepository.create({
        username: payload.username,
        password: hashedPassword,
        customer: { id: customerResp?.data?.id },
      });
      await this.authRepository.save(authEntity);

      return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
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
      if (!tokenData?.id) {
        throw new NotFoundException('Invalid refresh token');
      }

      const data = await this.__genToken(tokenData?.id);

      return new ResponseBuilder(data)
        .withCode(ResponseCodeEnum.SUCCESS)
        .build();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new NotFoundException('Invalid refresh token');
    }
  }

  private async __genToken(
    uid: string,
  ): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    const customer = await this.customerService.getCustomerById(uid);
    if (!customer?.data?.id) {
      throw new NotFoundException('Customer not found');
    }
    const jwtPayload = { id: customer.data.id };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload),
      this.jwtService.signAsync(jwtPayload, {
        secret: `${this.configService.get('JWT_REFRESH_SECRET')}`,
        expiresIn: `${this.configService.get('JWT_REFRESH_TTL')}`,
      }),
    ]);

    // // await this.__cacheDataToken(accessToken, jwtPayload);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.configService.get('JWT_TTL'),
    };
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

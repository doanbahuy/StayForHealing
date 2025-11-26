// import { omit } from 'lodash';
// import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
// import { IAuthService } from './interface/auth.service.interface';
// import { ICustomerService } from '@components/customer/interface/customer.service.interface';
// import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';
// import { RegisterCustomerRequestDto } from './dto/request/register-customer.request.dto';
// import { ResponseCodeEnum } from '@constant/response-code.enum';
// import { ResponseBuilder } from '@utils/response-builder';

// @Injectable()
// export class AuthService implements IAuthService {
//   private logger = new Logger();
//   constructor(
//     private readonly configService: ConfigService,

//     private jwtService: JwtService,

//     // @Inject(CacheService)
//     // private cacheService: CacheService,

//     @Inject('ICustomerService')
//     private customerService: ICustomerService,
//   ) {}

//   async registerCustomer(payload: RegisterCustomerRequestDto): Promise<any> {
//     try {
//       const customerResp = await this.customerService.create(payload);

//       const data = await this.__genToken(customerResp?.id);

//       return new ResponseBuilder(data)
//         .withCode(ResponseCodeEnum.SUCCESS)
//         .build();
//     } catch (error) {
//       throw error;
//     }
//   }

//   async verifyToken(request: any): Promise<any> {
//     const customerInfo = request?.customer || {};
//     if (!customerInfo?.id || !customerInfo?.token) {
//       throw new NotFoundException();
//     }

//     const customerResponse = omit(customerInfo, ['iat', 'token']);
//     if (customerInfo?.isFromCache) {
//       return new ResponseBuilder(customerResponse)
//         .withCode(ResponseCodeEnum.SUCCESS)
//         .build();
//     }

//     const customer = await this.customerService.getCustomerById(customerInfo.id);
//     if (!customer) {
//       throw new NotFoundException('Customer not found');
//     }

//     // await this.__cacheDataToken(request?.customer?.token, customerInfo);

//     return new ResponseBuilder(customerResponse)
//       .withCode(ResponseCodeEnum.SUCCESS)
//       .build();
//   }

//   async refreshToken(token: string): Promise<any> {
//     if (!token) {
//       throw new NotFoundException('Refresh token is required');
//     }
//     try {
//       const tokenData = await this.jwtService.verify(token, {
//         secret: `${this.configService.get('JWT_REFRESH_SECRET')}`,
//       });
//       if (!tokenData?.id) {
//         throw new NotFoundException('Invalid refresh token');
//       }

//       const data = await this.__genToken(tokenData?.id);

//       return new ResponseBuilder(data)
//         .withCode(ResponseCodeEnum.SUCCESS)
//         .build();
//       // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     } catch (error) {
//       throw new NotFoundException('Invalid refresh token');
//     }
//   }

//   private async __genToken(
//     uid: string,
//   ): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
//     const customer = await this.customerService.getCustomerById(uid);
//     if (!customer?.id) {
//       throw new NotFoundException('Customer not found');
//     }
//     const jwtPayload = { id: customer.id };

//     const [accessToken, refreshToken] = await Promise.all([
//       this.jwtService.signAsync(jwtPayload),
//       this.jwtService.signAsync(jwtPayload, {
//         secret: `${this.configService.get('JWT_REFRESH_SECRET')}`,
//         expiresIn: `${this.configService.get('JWT_REFRESH_TTL')}`,
//       }),
//     ]);

//     // await this.__cacheDataToken(accessToken, jwtPayload);

//     return {
//       accessToken,
//       refreshToken,
//       expiresIn: this.configService.get('JWT_TTL'),
//     };
//   }
// }

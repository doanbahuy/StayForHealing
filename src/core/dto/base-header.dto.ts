import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class BaseHeaderDto {
  @IsOptional()
  @Expose({ name: 'X-Merchant-ID' })
  xMerchantID: string;

  @IsOptional()
  @Expose({ name: 'Custom' })
  custom: string;

  @IsOptional()
  @Expose({ name: 'jwt-mobio' })
  jwtMobio: string;

  @IsOptional()
  @Expose({ name: 'appId' })
  appId: string;

  @IsOptional()
  @Expose({ name: 'deviceId' })
  deviceId: string;

  @IsOptional()
  @Expose({ name: 'Authorization' })
  authorization: string;
}

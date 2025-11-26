/* eslint-disable prettier/prettier */
import { BaseRequestDto } from '@core/dto/base-request.dto';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
export class RegisterCustomerRequestDto extends BaseRequestDto {
  @IsOptional()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  partnerCode: string;

  @IsNotEmpty()
  @IsString()
  partnerId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1)
  isTermsAccepted: number;
}

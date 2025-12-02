/* eslint-disable prettier/prettier */
import { CreateCustomerRequestDto } from '@components/customer/dto/request/create-customer.request.dto';
import { BaseRequestDto } from '@core/dto/base-request.dto';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
export class RegisterCustomerRequestDto extends BaseRequestDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCustomerRequestDto)
  customer?: CreateCustomerRequestDto;
}

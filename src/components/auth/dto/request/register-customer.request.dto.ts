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
  @IsNotEmpty()
  @IsString()
  customerName: string;
}

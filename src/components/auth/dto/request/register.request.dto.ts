/* eslint-disable prettier/prettier */
import { CreateUserRequestDto } from '@components/user/dto/request/create-user.request.dto';
import { BaseRequestDto } from '@core/dto/base-request.dto';
import { AccountEntity } from '@databases/postgres/entities/account.entity';
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

class UserDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsNumber()
  account: number;
}
export class RegisterRequestDto extends BaseRequestDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  role: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserDto)
  user?: UserDto;
}

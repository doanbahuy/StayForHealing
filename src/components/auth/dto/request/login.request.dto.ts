import { BaseRequestDto } from '@core/dto/base-request.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto extends BaseRequestDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

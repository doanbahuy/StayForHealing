import { BaseRequestDto } from '@core/dto/base-request.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserRequestDto extends BaseRequestDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;
}

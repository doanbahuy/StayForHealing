import { BaseResponseDto } from '@core/dto/base-response.dto';
import { Expose } from 'class-transformer';

export class UsersResponseDto extends BaseResponseDto {
  @Expose()
  id: number;

  @Expose()
  fullName: string;
}

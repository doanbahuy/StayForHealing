import { BaseResponseDto } from '@core/dto/base-response.dto';
import { Exclude, Expose } from 'class-transformer';

export class UsersResponseDto extends BaseResponseDto {
  @Expose()
  customerCode: string;

  @Expose()
  username: string;

  @Expose()
  status: number;
}

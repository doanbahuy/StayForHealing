import { BaseResponseDto } from '@core/dto/base-response.dto';
import { Exclude, Expose } from 'class-transformer';

export class CustomersResponseDto extends BaseResponseDto {
  @Expose()
  id: string;

  @Expose()
  customerCode: string;

  @Expose()
  customerName: string;

  @Expose()
  status: number;
}

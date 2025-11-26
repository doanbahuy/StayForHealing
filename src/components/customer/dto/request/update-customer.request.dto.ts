import { BaseRequestDto } from '@core/dto/base-request.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCustomerRequestDto extends BaseRequestDto {
  @IsNotEmpty()
  @IsString()
  customerName: string;
}

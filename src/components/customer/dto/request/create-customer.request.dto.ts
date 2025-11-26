import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCustomerRequestDto {
  @IsNotEmpty()
  @IsString()
  customerName: string;
}

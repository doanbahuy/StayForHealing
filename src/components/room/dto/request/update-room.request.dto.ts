import { BaseRequestDto } from '@core/dto/base-request.dto';
import { IsNumber, IsString } from 'class-validator';

export class UpdateRoomRequestDto extends BaseRequestDto {
  @IsNumber()
  capacity: number;

  @IsString()
  roomCode: string;

  @IsNumber()
  base_price: number;

  @IsNumber()
  status: number;
}

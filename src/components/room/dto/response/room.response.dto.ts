import { BaseResponseDto } from '@core/dto/base-response.dto';
import { Expose } from 'class-transformer';

export class RoomResponseDto extends BaseResponseDto {
  @Expose()
  id: number;

  @Expose()
  roomCode: string;

  @Expose()
  capacity: number;

  @Expose()
  base_price: number;

  @Expose()
  status: number;
}

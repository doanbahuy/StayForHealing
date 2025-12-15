import { HomestayResponseDto } from '@components/homestay/dto/response/homestay.response.dto';
import { BaseResponseDto } from '@core/dto/base-response.dto';
import { Expose, Type } from 'class-transformer';

export class OwnerDto {
  @Expose()
  id: number;

  @Expose()
  customerCode: string;

  @Expose()
  customerName: string;
}
export class HomestayDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  address: string;

  @Expose()
  description: string;

  @Expose()
  @Type(() => OwnerDto)
  owner: OwnerDto;
}
export class RoomResponseDto extends BaseResponseDto {
  @Expose()
  roomCode: string;

  @Expose()
  capacity: number;

  @Expose()
  base_price: number;

  @Expose()
  status: number;

  @Expose()
  @Type(() => HomestayResponseDto)
  home: HomestayResponseDto;
}

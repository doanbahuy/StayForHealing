import { BaseResponseDto } from '@core/dto/base-response.dto';
import { Expose, Type } from 'class-transformer';

export class UserDto {
  @Expose()
  username: string;

  @Expose()
  email: string;
}

export class RoomDto {
  @Expose()
  roomCode: string;

  @Expose()
  capacity: number;

  @Expose()
  base_price: number;
}

export class BookingResponseDto extends BaseResponseDto {
  @Expose()
  @Type(() => UserDto)
  account: UserDto;

  @Expose()
  @Type(() => RoomDto)
  room: RoomDto;

  @Expose()
  checkInDate: string;

  @Expose()
  checkOutDate: string;

  @Expose()
  guests: number;

  @Expose()
  status: string;
}

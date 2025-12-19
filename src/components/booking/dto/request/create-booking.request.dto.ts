import { BaseRequestDto } from '@core/dto/base-request.dto';
import { AccountEntity } from '@databases/postgres/entities/account.entity';
import { RoomEntity } from '@databases/postgres/entities/room.entity';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateBookingRequestDto extends BaseRequestDto {
  @IsNotEmpty()
  @IsNumber()
  accountId: number;

  @IsNotEmpty()
  @IsNumber()
  roomId: number;

  @IsNotEmpty()
  @IsString()
  checkInDate: string;

  @IsNotEmpty()
  @IsString()
  checkOutDate: string;

  @IsNotEmpty()
  @IsNumber()
  guests: number;
}

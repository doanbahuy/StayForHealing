import { HomestayEntity } from '@databases/postgres/entities/homestay.entity';
/* eslint-disable prettier/prettier */

import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class CreateRoomRequestDto {
  @IsNotEmpty()
  @IsString()
  roomCode: string;

  @IsNotEmpty()
  @IsNumber()
  capacity: number;

  @IsNotEmpty()
  @IsNumber()
  base_price: number;

  @IsOptional()
  @ValidateNested()
  @Type(() =>  HomestayEntity)
  home?: HomestayEntity;

  @IsNumber()
  status: number;
}

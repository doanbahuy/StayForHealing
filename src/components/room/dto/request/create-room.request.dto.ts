/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsNumber, IsString } from "class-validator";

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

  @IsNotEmpty()
  @IsNumber()
  homeOwner?: number;

  @IsNumber()
  status?: number = 1;
}

/* eslint-disable prettier/prettier */
import { BaseResponseDto } from '@core/dto/base-response.dto';
// import { UserEntity } from "@databases/postgres/entities/user.entity";
import { Expose, Type } from 'class-transformer';

export class OwnerDto {
  @Expose()
  id: number;

  @Expose()
  userName: string;
}

export class HomestayResponseDto extends BaseResponseDto {
  @Expose()
  id: number;

  @Expose()
  description: string;

  @Expose()
  address: string;

  @Expose()
  title: string;

  @Expose()
  @Type(() => OwnerDto)
  owner: OwnerDto;
}

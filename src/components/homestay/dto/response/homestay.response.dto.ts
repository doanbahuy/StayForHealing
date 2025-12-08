/* eslint-disable prettier/prettier */
import { BaseResponseDto } from "@core/dto/base-response.dto";
// import { CustomerEntity } from "@databases/postgres/entities/customer.entity";
import { Expose, Type } from "class-transformer";

export class OwnerResponseDto {
  @Expose()
  id: number;

  @Expose()
  customerCode: string;

  @Expose()
  customerName: string;
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
  @Type(() => OwnerResponseDto)
  owner: OwnerResponseDto;
}
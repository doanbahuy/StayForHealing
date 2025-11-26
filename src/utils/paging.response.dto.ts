import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
export class MetaPaging {
  @ApiProperty()
  @Expose()
  total: number;

  @ApiProperty()
  @Expose()
  page: number;

  @Expose()
  totalPage?: number;
}

export class PagingResponseDto<T> {
  items: T;

  @ApiProperty({ type: MetaPaging })
  @Expose()
  @Type(() => MetaPaging)
  meta?: MetaPaging;
}

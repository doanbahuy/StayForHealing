import { Expose } from 'class-transformer';
export class BaseResponseDto {
  @Expose()
  id: number;
}

import { Expose } from 'class-transformer';

export class BasicResponseDto {
  @Expose()
  id: string | number;

  @Expose()
  name: string;
}

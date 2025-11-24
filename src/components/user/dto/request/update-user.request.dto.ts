import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserRequestDto {
  @IsNotEmpty()
  @IsString()
  customerCode: string;
  @IsNotEmpty()
  @IsString()
  username: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
class RegisterUserDto {
  @ApiProperty({ description: 'Access token' })
  @Expose()
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Thời gian token hết hạn',
  })
  expiresIn: string;
}

export class RegisterUserResponseDto {
  @ApiProperty({ type: RegisterUserDto })
  data?: RegisterUserDto;
}

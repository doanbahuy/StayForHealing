import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
class LoginDto {
  @ApiProperty({ description: 'Access token' })
  @Expose()
  accessToken: string;

  @Expose()
  @ApiProperty({
    description: 'Refresh token',
  })
  refreshToken: string;

  @Expose()
  @ApiProperty({
    description: 'Thời gian token hết hạn',
  })
  expiresIn: string;
}

export class LoginResponseDto {
  @Expose()
  @ApiProperty({ type: LoginDto })
  data?: LoginDto;
}

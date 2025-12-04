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

class UserDataDto {
  @Expose()
  @ApiProperty({ description: 'User ID' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Username' })
  username: string;

  @Expose()
  @ApiProperty({ description: 'Role' })
  role: string;
}

export class LoginResponseDto {
  @Expose()
  @ApiProperty({ type: LoginDto })
  data?: LoginDto;

  @Expose()
  @ApiProperty({ type: UserDataDto })
  user?: UserDataDto;
}

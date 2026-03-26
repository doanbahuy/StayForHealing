import { Body, Controller, Get, Inject, Post, Req } from '@nestjs/common';
import { IAuthService } from './interface/auth.service.interface';
import { Public } from '@core/decorator/set-public.decorator';
import { RegisterRequestDto } from './dto/request/register.request.dto';
import { LoginRequestDto } from './dto/request/login.request.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('IAuthService')
    private readonly authService: IAuthService,
  ) {}

  @Public()
  @Post('/login')
  async login(@Body() req: LoginRequestDto): Promise<any> {
    return this.authService.login(req);
  }

  @Get('/verify-token')
  async verify(@Req() request) {
    return this.authService.verifyToken(request);
  }

  @Post('/refresh-token')
  @Public()
  async refreshToken(@Body() request) {
    const token = request?.refreshToken;
    return this.authService.refreshToken(token);
  }

  @Post('/register')
  @Public()
  async registerUser(@Body() payload: RegisterRequestDto) {
    return await this.authService.register(payload);
  }
}

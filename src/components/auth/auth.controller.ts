import { Body, Controller, Get, Inject, Post, Req } from '@nestjs/common';
import { IAuthService } from './interface/auth.service.interface';
import { Public } from '@core/decorator/set-public.decorator';
import { RegisterCustomerRequestDto } from './dto/request/register-customer.request.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('IAuthService')
    private readonly authService: IAuthService,
  ) {}

  @Post('/login')
  async login(@Req() req: Request): Promise<any> {
    return this.authService.login(req.body);
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
  async registerCustomer(@Body() payload: RegisterCustomerRequestDto) {
    return await this.authService.registerCustomer(payload);
  }
}

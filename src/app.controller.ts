import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { RateLimitGuard } from '@core/guards/rate-limit.guard';
import { Public } from '@core/decorator/set-public.decorator';
import { RateLimit } from '@core/decorator/rate-limit.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @RateLimit({ window: 10000, max: 5 })
  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

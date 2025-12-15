import { RateLimitService } from '@core/components/redis/rate-limit.service';
import { RATE_LIMIT_OPTIONS } from '@core/decorator/rate-limit.decorator';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly rateLimitService: RateLimitService,

    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const route = req.route;
    const ip = req.ip || req.connection.remoteAddress;

    const { window, max } = this.reflector.get(
      RATE_LIMIT_OPTIONS,
      context.getHandler(),
    ) || {
      window: 60000,
      max: 60,
    };

    await this.rateLimitService.slidingWindowLimit(ip, window, max, route);
    return true;
  }
}

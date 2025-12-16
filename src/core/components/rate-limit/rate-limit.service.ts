import { Injectable, BadRequestException, HttpException } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RateLimitService {
  private redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  });

  async slidingWindowLimit(
    key: string,
    windowMs: number,
    maxRequests: number,
    route: string,
  ) {
    const now = Date.now();

    const startWindow = now - windowMs;

    const redisKey = `rate_limit`;

    const pipeline = this.redis.multi();

    pipeline.zremrangebyscore(redisKey, 0, startWindow);

    pipeline.zadd(redisKey, now, now.toString());

    pipeline.zcard(redisKey);

    pipeline.expire(redisKey, Math.ceil(windowMs / 1000));

    const [_, __, count] = await pipeline.exec();

    if (Number(count[1]) > maxRequests) {
      throw new HttpException(
        {
          statusCode: 429,
          message: `Rate limit exceeded. Only ${maxRequests} requests allowed per ${windowMs / 1000}s`,
        },
        429,
      );
    }
  }
}

import { Module, Global } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';
import * as redisStore from 'cache-manager-redis-store';

@Global()
@Module({
  imports: [
    NestCacheModule.register({
      store: redisStore as any,
      url: process.env.REDIS_URL,
      ttl: 60, // default TTL
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}

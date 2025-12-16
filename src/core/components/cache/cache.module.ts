import { Module, Global } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';
import * as redisStore from 'cache-manager-redis-store';

@Global() // 👈 cho dùng toàn app
@Module({
  imports: [
    NestCacheModule.register({
      store: redisStore as any,
      url: 'redis://127.0.0.1:6379',
      ttl: 60, // default TTL
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}

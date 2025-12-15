import { Module } from '@nestjs/common';
import { CacheService } from '@core/components/cache/cache.service';

@Module({
  imports: [],
  providers: [
    {
      provide: 'ICacheService',
      useClass: CacheService,
    },
  ],
  exports: [
    {
      provide: 'ICacheService',
      useClass: CacheService,
    },
  ],
})
export class CacheModule {}

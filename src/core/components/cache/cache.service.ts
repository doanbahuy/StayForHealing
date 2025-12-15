import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private logger = new Logger(CacheService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getData() {
    const key = 'demo:data';

    const cached = await this.cacheManager.get(key);
    if (cached) {
      console.log('CACHE HIT');
      return cached;
    }

    console.log('DB HIT');
    const data = { time: new Date() };

    await this.cacheManager.set(key, data, 30); // TTL 30s

    return data;
  }
  async setCache(key: string, value: any, ttl?: number): Promise<any> {
    try {
      if (value === null) {
        value = false;
      }
      if (ttl) {
        return await this.cacheManager.set(key, value, { ttl } as any);
      } else {
        return await this.cacheManager.set(key, value);
      }
    } catch (error) {
      this.logger.error('set cache Error', error);
      return null;
    }
  }
}

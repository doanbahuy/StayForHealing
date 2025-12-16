import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private logger = new Logger(CacheService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getCache(key: string, ttl = 30): Promise<any> {
    try {
      return await await this.cacheManager.get(key);
    } catch (error) {
      this.logger.error('Get cache error', error);
      return null;
    }
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
      this.logger.error('Set cache Error', error);
      return null;
    }
  }

  async clearCache(key: string) {
    try {
      await this.cacheManager.del(key);
    } catch (error) {
      this.logger.error(`Delete cache error with key: ${key}`, error);
    }
  }
}

// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { Inject, Injectable, Logger } from '@nestjs/common';
// import { Cache } from 'cache-manager';
// import { CacheServiceInterface } from './interface/cache.service.interface';
// import { CACHE_TTL_DEFAULT } from '@utils/constant';
// export type Seconds = number;
// @Injectable()
// export class CacheService implements CacheServiceInterface {
//   private logger = new Logger(CacheService.name);
//   constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

//   async getCache(key: string): Promise<any> {
//     try {
//       return await this.cacheManager.get(key);
//     } catch {
//       this.logger.warn('Cache Error');
//       return null;
//     }
//   }

//   async setCache(key: string, value, ttl?: Seconds): Promise<any> {
//     try {
//       return await this.cacheManager.set(key, value, ttl || CACHE_TTL_DEFAULT);
//     } catch {
//       this.logger.warn('Cache Error');
//       return null;
//     }
//   }

//   async delCache(key: string): Promise<any> {
//     return await this.cacheManager.del(key);
//   }

//   async resetCache(): Promise<any> {
//     return await this.cacheManager.reset();
//   }

//   async wrapCache(key: string, value: any): Promise<any> {
//     return await this.cacheManager.wrap(key, value);
//   }
// }

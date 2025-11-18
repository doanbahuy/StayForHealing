import { HttpService } from '@nestjs/axios';
import { Inject } from '@nestjs/common';
import { genericRetryStrategy } from '@utils/rxjs-util';
import { catchError, firstValueFrom, map, of, retry } from 'rxjs';
import { HttpClientServiceInterface } from './interface/http-client.service.interface';
import { ConfigService } from '@config/config.service';

export class HttpClientService implements HttpClientServiceInterface {
  constructor(
    @Inject(HttpService)
    private httpService: HttpService,

    private readonly configService: ConfigService,
  ) {
    if (this.httpService.axiosRef.defaults.headers) {
      const token = this.configService.get('internalToken');
      this.httpService.axiosRef.defaults.headers.common[
        'authorization'
      ] = `${token}`;
    }
  }

  async get(url: string, params?: any, options?: any): Promise<any> {
    return await firstValueFrom(
      this.httpService
        .get(url, {
          params: params,
          ...options,
          // paramsSerializer: (params) => {
          //   return JSON.stringify(params);
          // },
        })
        .pipe(
          map((response) => response.data),
          retry(genericRetryStrategy(options)),
          catchError((error) => of(error)),
        ),
    );
  }

  async post(url: string, body?: any, options: any = {}): Promise<any> {
    return await firstValueFrom(
      this.httpService.post(url, body, options).pipe(
        map((response) => response.data),
        retry(genericRetryStrategy(options)),
        catchError((error) => of(error)),
      ),
    );
  }

  async put(url: string, body?: any, options: any = {}): Promise<any> {
    return await firstValueFrom(
      this.httpService.put(url, body, options).pipe(
        map((response) => response.data),
        retry(genericRetryStrategy(options)),
        catchError((error) => of(error)),
      ),
    );
  }

  async delete(url: string, params?: any, options: any = {}): Promise<any> {
    return await firstValueFrom(
      this.httpService
        .delete(url, {
          params: params,
          ...options,
          paramsSerializer: (params) => {
            return JSON.stringify(params);
          },
        })
        .pipe(
          map((response) => response.data),
          retry(
            genericRetryStrategy({
              scalingDuration: 1000,
              excludedStatusCodes: [409],
            }),
          ),
          catchError((error) => of(error)),
        ),
    );
  }
}

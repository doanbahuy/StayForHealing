import { HttpClientService } from './http-client.service';
import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@config/config.module';
import { HttpInternalService } from '@core/components/http-client/http-client-internal.service';

@Global()
@Module({
  imports: [
    HttpModule.register({
      timeout: 60000,
      maxRedirects: 5,
    }),
    ConfigModule,
  ],
  providers: [HttpClientService, HttpInternalService],
  exports: [HttpClientService, HttpInternalService],
})
export class HttpClientModule {}

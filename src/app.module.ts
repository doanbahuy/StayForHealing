import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from '@core/middleware/logger.middleware';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmConfigService } from '@databases/postgres/config/database.config';
import { AuthorizationGuard } from '@core/guards/authorization.guard';
import { envConfig } from '@config/config.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from '@core/core.module';
import { AuthModule } from '@components/auth/auth.module';

import { APP_PIPE } from '@nestjs/core';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '@config/jwt.config';
import { CustomerModule } from '@components/customer/customer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      validate: envConfig,
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        console.log('=====DataSourceOptions=====', options);
        return new DataSource(options).initialize();
      },
    }),
    CustomerModule,
    CoreModule,
    AuthModule,
    JwtModule.register(jwtConfig),
  ],
  controllers: [AppController],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthorizationGuard,
    // },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

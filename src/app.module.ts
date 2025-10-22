import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envConfig } from '@config/config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      validate: envConfig,
      isGlobal: true,
      cache: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

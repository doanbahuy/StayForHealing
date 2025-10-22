import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyMultipart from 'fastify-multipart';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter({ bodyLimit: 50048576 });
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter
  );

  fastifyAdapter.register(fastifyMultipart, {
    attachFieldsToBody: true,
    addToBody: true,
  });

  const configService = app.get(ConfigService);

  const corsOptions = {
    origin:'*',
    allowedHeaders: '*',
  };

  await app.startAllMicroservices();
  await app.listen(3001);
}

bootstrap();

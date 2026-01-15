import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ExceptionInterceptor } from '@core/interceptors/exception.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fastifyMultipart from 'fastify-multipart';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggingInterceptor } from '@core/interceptors/logging.interceptor';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter({ bodyLimit: 50048576 });
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
    process.env.NODE_ENV.startsWith('prod')
      ? { logger: ['error', 'warn', 'log'] }
      : { logger: ['debug', 'error', 'warn', 'log'] },
  );

  fastifyAdapter.register(fastifyMultipart, {
    attachFieldsToBody: true,
    addToBody: true,
  });

  const configService = app.get(ConfigService);

  const corsOptions = {
    origin: configService.get('CORS_ORIGIN'),
    allowedHeaders: configService.get('CORS_ALLOWED_HEADERS'),
  };

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  app.register(require('@fastify/cors'), corsOptions);

  app.setGlobalPrefix(configService.get('API_PATH'));
  const options = new DocumentBuilder()
    .setTitle('API docs')
    .addTag('users')
    .addTag('tasks')
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: 'x-api-version',
  });
  await app.useGlobalInterceptors(
    new ExceptionInterceptor(),
    app.get(LoggingInterceptor),
  );

  await app.startAllMicroservices();
  await app.listen(configService.get('SERVER_HTTP_PORT'), '0.0.0.0');
}

bootstrap();

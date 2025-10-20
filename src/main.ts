import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import multipart from '@fastify/multipart';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter({ bodyLimit: 50048576 });
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
    { logger: ['error', 'warn', 'log'] },
  );

  fastifyAdapter.register(multipart, {
    attachFieldsToBody: true,
    addToBody: true,
  });

  const corsOptions = {
    origin: '*',
    allowedHeaders: '*',
  };

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  app.register(require('@fastify/cors'), corsOptions);
  const options = new DocumentBuilder()
    .setTitle('API docs')
    .addTag('users')
    .addTag('tasks')
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  // await app.useGlobalPipes(new SortQueryPipe());
  // await app.useGlobalPipes(new FilterQueryPipe());
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: 'x-api-version',
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

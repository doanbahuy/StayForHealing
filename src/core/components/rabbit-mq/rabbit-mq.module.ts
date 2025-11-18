import { ConfigService } from '@config/config.service';
import { Global, Module } from '@nestjs/common';
import { ClientsModule, ClientsModuleOptions } from '@nestjs/microservices';
import { CUSTOMER_SERVICE } from './rabbit-mq.constant';
import { RabbitMqService } from './rabbit-mq.service';
import { ConfigModule } from '@config/config.module';

const configService = new ConfigService();
@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: CUSTOMER_SERVICE,
        ...configService.get('rabbitOption'),
      },
    ] as ClientsModuleOptions),
    ConfigModule,
  ],
  providers: [
    {
      provide: 'IRabbitMqService',
      useClass: RabbitMqService,
    },
  ],
  exports: [
    ClientsModule.register([
      {
        name: CUSTOMER_SERVICE,
        ...configService.get('rabbitOption'),
      },
    ] as ClientsModuleOptions),
    {
      provide: 'IRabbitMqService',
      useClass: RabbitMqService,
    },
  ],
})
export class RabbitModule {}

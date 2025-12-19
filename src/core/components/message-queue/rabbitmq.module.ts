import { Global, Module } from '@nestjs/common';
import * as amqp from 'amqplib';
import { RabbitMQService } from './rabbitmq.service';

@Global()
@Module({
  providers: [
    {
      provide: 'RABBITMQ_CONNECTION',
      useFactory: async () => {
        return amqp.connect('amqp://localhost:5672');
      },
    },
    RabbitMQService,
  ],
  exports: ['RABBITMQ_CONNECTION', RabbitMQService],
})
export class RabbitMQModule {}

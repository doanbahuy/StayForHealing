import { Inject, Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService {
  constructor(
    @Inject('RABBITMQ_CONNECTION')
    private readonly conn: amqp.Connection,
  ) {}

  async publish(exchange: string, routingKey: string, payload: any) {
    const channel = await this.conn.createChannel();

    await channel.assertExchange(exchange, 'topic', { durable: true });

    channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(payload)),
      { persistent: true },
    );
  }
}

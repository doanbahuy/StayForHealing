import { Inject, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

export class EmailConsumer implements OnModuleInit {
  constructor(
    @Inject('RABBITMQ_CONNECTION')
    private readonly conn: amqp.Connection,
  ) {}

  async onModuleInit() {
    const channel = await this.conn.createChannel();

    await channel.assertExchange('email_exchange', 'topic', {
      durable: true,
    });

    await channel.assertQueue('email_queue', {
      durable: true,
    });

    await channel.bindQueue('email_queue', 'email_exchange', 'email.send');

    channel.consume('email_queue', (msg) => {
      if (!msg) return;

      const data = JSON.parse(msg.content.toString());
      console.log('Send email:', data);

      channel.ack(msg);
    });
  }
}

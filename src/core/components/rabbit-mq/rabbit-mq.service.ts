import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { connect, Channel, ConsumeMessage } from 'amqplib';
import { IRabbitMqService } from './interface/rabbit-mq.service.interface';
import { EXPIRATION, QueueResult, RETRY_NUM_MAX } from './rabbit-mq.constant';
import { ConfigService } from '@config/config.service';

@Injectable()
export class RabbitMqService implements IRabbitMqService, OnModuleInit {
  private connection;
  private channel: Channel;
  private logger = new Logger('RabbitMQ service');

  constructor(private readonly configService: ConfigService) {}
  async onModuleInit() {
    try {
      this.connection = await connect(
        this.configService.get('rabbitOption').options.urls[0],
      );
      this.channel = await this.connection.createChannel();
    } catch (err) {
      this.logger.error('===== rabbit connect start error log =====');
      this.logger.error(err);
      this.logger.error('===== rabbit connect end error log =====');
    }
  }

  async addToQueue(queueName: string, message: object) {
    try {
      await this.channel.assertQueue(queueName);
      this.channel.sendToQueue(
        queueName,
        Buffer.from(JSON.stringify(message)),
        { expiration: EXPIRATION },
      );
    } catch (err) {
      this.logger.error('===== rabbit addToQueue start error log =====');
      this.logger.error(err);
      this.logger.error('===== rabbit addToQueue end error log =====');
    }
  }

  async createConsumer(
    queueName: string,
    callback: (id: string) => Promise<any>,
  ) {
    try {
      await this.channel.assertQueue(queueName);
      await this.channel.consume(queueName, async (message: ConsumeMessage) => {
        const result = await callback(JSON.parse(message.content.toString()));
        const content = JSON.parse(message.content.toString());
        this.channel.ack(message);
        // handle retry
        if (
          result === QueueResult.Fail &&
          (!content.retryNum || content.retryNum < RETRY_NUM_MAX)
        ) {
          if (!content.retryNum) content.retryNum = 1;
          else content.retryNum++;
          await this.addToQueue(queueName, content);
        } else if (content.retryNum >= RETRY_NUM_MAX) {
          // @TODO save log
        }
      });
    } catch (err) {
      this.logger.error('===== rabbit createConsumer start error log =====');
      this.logger.error(err);
      this.logger.error('===== rabbit createConsumer end error log =====');
    }
  }

  async close() {
    try {
      await this.channel.close();
      await this.connection.close();
    } catch (err) {
      this.logger.error('===== rabbit close start error log =====');
      this.logger.error(err);
      this.logger.error('===== rabbit close end error log =====');
    }
  }
}

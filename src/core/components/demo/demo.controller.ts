import { Controller, Get } from '@nestjs/common';
import { RabbitMQService } from '../message-queue/rabbitmq.service';
import { Public } from '@core/decorator/set-public.decorator';

@Controller('demo')
export class DemoController {
  constructor(private readonly mq: RabbitMQService
    
  ) {}

  @Public()
  @Get('send-email')
  async sendEmail() {
    await this.mq.publish('email_exchange', 'email.send', {
      to: 'user@gmail.com',
      subject: 'Hello RabbitMQ',
    }); 

    return { status: 'Message sent' };
  }
}

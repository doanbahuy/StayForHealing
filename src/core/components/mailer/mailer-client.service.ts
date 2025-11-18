import { of } from 'rxjs';
import { MailerClientServiceInterface } from './interface/mailer-client.interface';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailerClientService implements MailerClientServiceInterface {
  private readonly logger = new Logger(MailerClientService.name);
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(options: ISendMailOptions): Promise<any> {
    return await this.mailerService
      .sendMail(options)
      .then((response: any) => {
        this.logger.log(
          '🚀 ~ MailerClientService ~ .then ~ response:',
          response,
        );

        return of({
          status: 1,
        });
      })
      .catch((err) => {
        this.logger.error(
          '🚀 ~ MailerClientService ~ sendMail ~ err: ' + err.message,
          err.stack,
        );
        return of({
          status: 0,
        });
      });
  }
}

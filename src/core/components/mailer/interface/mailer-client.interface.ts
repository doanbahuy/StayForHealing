import { ISendMailOptions } from '@nestjs-modules/mailer';

export interface SendMailOption extends ISendMailOptions {
  subject?: string;
  html?: string;
  isHtml?: boolean;
}
export interface MailerClientServiceInterface {
  sendMail(options: SendMailOption): Promise<void>;
}

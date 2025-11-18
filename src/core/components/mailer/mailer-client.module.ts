import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { MailerClientService } from './mailer-client.service';

@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAILER_HOST,
        port: +process.env.MAILER_PORT,
        auth: {
          user: process.env.MAILER_USER,
          pass: process.env.MAILER_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
    }),
  ],
  providers: [
    {
      provide: 'MailerClientServiceInterface',
      useClass: MailerClientService,
    },
  ],
  exports: [
    {
      provide: 'MailerClientServiceInterface',
      useClass: MailerClientService,
    },
  ],
})
export class ClientMailerModule {}

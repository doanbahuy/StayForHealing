// import { CustomerService } from '@components/customer/customer.service';
import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CustomerModule } from '@components/customer/customer.module';
import { AccountEntity } from '@databases/postgres/entities/account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    HttpModule,
    CustomerModule,
    TypeOrmModule.forFeature([AccountEntity]),
  ],
  providers: [
    {
      provide: 'IAuthService',
      useClass: AuthService,
    },
  ],
  exports: [
    {
      provide: 'IAuthService',
      useClass: AuthService,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}

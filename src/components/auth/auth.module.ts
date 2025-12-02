// import { CustomerService } from '@components/customer/customer.service';
import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

@Module({
  imports: [HttpModule],
  providers: [
    // {
    //   provide: 'IAuthService',
    //   useClass: AuthService,
    // },
    // {
    //   provide: 'ICustomerService',
    //   useClass: CustomerService,
    // },
  ],
  exports: [
    // {
    //   provide: 'IAuthService',
    //   useClass: AuthService,
    // },
  ],
  controllers: [AuthController],
})
export class AuthModule {}

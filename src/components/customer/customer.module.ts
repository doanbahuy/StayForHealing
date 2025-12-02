import { Module } from '@nestjs/common';
import { CustomerService } from '@components/customer/customer.service';
import { CustomerController } from '@components/customer/customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from '@databases/postgres/entities/customer.entity';
import { AuthEntity } from '@databases/postgres/entities/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity, AuthEntity])],
  providers: [
    {
      provide: 'ICustomerService',
      useClass: CustomerService,
    },
  ],
  controllers: [CustomerController],
  exports: [
    {
      provide: 'ICustomerService',
      useClass: CustomerService,
    },
  ],
})
export class CustomerModule {}

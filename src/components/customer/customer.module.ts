import { Module } from '@nestjs/common';
import { CustomerService } from '@components/customer/customer.service';
import { CustomerController } from '@components/customer/customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from '@databases/postgres/entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity])],
  providers: [
    {
      provide: 'ICustomerService',
      useClass: CustomerService,
    },
  ],
  controllers: [CustomerController],
})
export class CustomerModule {}

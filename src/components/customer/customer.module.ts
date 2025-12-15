import { Module } from '@nestjs/common';
import { CustomerService } from '@components/customer/customer.service';
import { CustomerController } from '@components/customer/customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from '@databases/postgres/entities/customer.entity';
import { AccountEntity } from '@databases/postgres/entities/account.entity';
import { CacheService } from '@core/components/cache/cache.service';
import { CacheModule } from '@core/components/cache/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity, AccountEntity]),
    CacheModule,
  ],
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

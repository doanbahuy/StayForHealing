import { CustomerService } from '@components/customer/customer.service';
import { HomestayEntity } from '@databases/postgres/entities/homestay.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { HomestayService } from './homestay.service';
import { HomestayController } from './homestay.controller';
import { CustomerEntity } from '@databases/postgres/entities/customer.entity';
import { AccountEntity } from '@databases/postgres/entities/account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([HomestayEntity, CustomerEntity, AccountEntity]),
  ],
  providers: [
    {
      provide: 'ICustomerService',
      useClass: CustomerService,
    },
    {
      provide: 'IHomestayService',
      useClass: HomestayService,
    },
  ],
  exports: [
    {
      provide: 'IHomestayService',
      useClass: HomestayService,
    },
  ],
  controllers: [HomestayController],
})
export class HomestayModule {}

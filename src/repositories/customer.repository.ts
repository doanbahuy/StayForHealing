import { BaseAbstractRepository } from '../core/repositories/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICustomerRepository } from './interface/customer.repository.interface';
import { CustomerEntity } from '@databases/postgres/entities/customer.entity';

@Injectable()
export class CustomerRepository
  extends BaseAbstractRepository<CustomerEntity>
  implements ICustomerRepository
{
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly repository: Repository<CustomerEntity>,
  ) {
    super(repository);
  }

  createEntity(data: any) {
    const entity = new CustomerEntity();
    Object.assign(entity, data);

    return entity;
  }

  createEntities(data: any) {
    return data.map((item: any) => {
      const entity = new CustomerEntity();

      Object.assign(entity, item);
      return entity;
    });
  }

  async detailCustomer(request: any) {
    const query = this.repository
      .createQueryBuilder('customer')
      .select('customer.id', 'id')
      .innerJoin(
        'customer_details',
        'customer_detail',
        'customer_detail.customer_id = customer.id  ',
      )
      .where('customer.id = :id', { id: request.id })
      .addSelect('customer.customerName', 'customerName')
      .addSelect('customer.phone_number', 'phone_number')
      .addSelect('customer.partner_code', 'partner_code')
      .addSelect('customer.partner_id', 'partner_id')
      .addSelect('customer_detail.fullname', 'fullname')
      .addSelect('customer_detail.gender', 'gender')
      .addSelect('customer_detail.gender_code', 'gender_code')
      .addSelect('customer_detail.email', 'email')
      .addSelect('customer_detail.birth_date', 'birth_date')
      .addSelect('customer_detail.citizen_pid', 'citizen_pid')
      .addSelect('customer_detail.date_of_issue', 'date_of_issue')
      .addSelect('customer_detail.id_card_expire_date', 'id_card_expire_date')
      .addSelect('customer_detail.issuing_authority', 'issuing_authority')
      .addSelect('customer_detail.living_place_address', 'living_place_address')
      .addSelect('customer_detail.hub_code', 'hubCode')
      .addSelect(
        'customer_detail.living_place_village_code',
        'living_place_village_code',
      );
    return query.getRawOne();
  }
}

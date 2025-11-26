import { BaseAbstractRepository } from '@core/repositories/base.abstract.repository';
import { CustomerEntity } from '@databases/postgres/entities/customer.entity';

export interface ICustomerRepository
  extends BaseAbstractRepository<CustomerEntity> {
  createEntity(data: any);
  createEntities(data: any);
  detailCustomer(request: any);
}

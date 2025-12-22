import { CustomerEntity } from '../../databases/postgres/entities/customer.entity';

export interface ICustomerRepository {
  createEntity(data: any): CustomerEntity;
  createEntities(data: any[]): CustomerEntity[];
  // Add custom query method signatures here
}

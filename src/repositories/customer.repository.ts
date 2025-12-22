import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from '../databases/postgres/entities/customer.entity';
import { ICustomerRepository } from './interface/customer-repository.interface';

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly repository: Repository<CustomerEntity>,
  ) {}

  createEntity(data: any) {
    const entity = new CustomerEntity();
    Object.assign(entity, data);
    return entity;
  }

  createEntities(data: any[]) {
    return data.map((item) => {
      const entity = new CustomerEntity();
      Object.assign(entity, item);
      return entity;
    });
  }

  // Add custom query methods here
}

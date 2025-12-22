import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from '../databases/postgres/entities/account.entity';
import { IAccountRepository } from './interface/account-repository.interface';

@Injectable()
export class AccountRepository implements IAccountRepository {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly repository: Repository<AccountEntity>,
  ) {}

  createEntity(data: any) {
    const entity = new AccountEntity();
    Object.assign(entity, data);
    return entity;
  }

  createEntities(data: any[]) {
    return data.map((item) => {
      const entity = new AccountEntity();
      Object.assign(entity, item);
      return entity;
    });
  }

  // Add custom query methods here
}

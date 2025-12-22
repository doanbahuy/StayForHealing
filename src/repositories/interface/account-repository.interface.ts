import { AccountEntity } from '../../databases/postgres/entities/account.entity';

export interface IAccountRepository {
  createEntity(data: any): AccountEntity;
  createEntities(data: any[]): AccountEntity[];
  // Add custom query method signatures here
}

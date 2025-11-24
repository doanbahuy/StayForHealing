import { BaseAbstractRepository } from '@core/repositories/base.abstract.repository';
import { UserEntity } from '@databases/postgres/entities/user.entity';

export interface IUserRepository extends BaseAbstractRepository<UserEntity> {
  createEntity(data: any);
  createEntities(data: any);
  detailUser(request: any);
}

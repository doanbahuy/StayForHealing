import { UserEntity } from '../../databases/postgres/entities/user.entity';

export interface IUserRepository {
  createEntity(data: any): UserEntity;
  createEntities(data: any[]): UserEntity[];
  // Add custom query method signatures here
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../databases/postgres/entities/user.entity';
import { IUserRepository } from './interface/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  createEntity(data: any) {
    const entity = new UserEntity();
    Object.assign(entity, data);
    return entity;
  }

  createEntities(data: any[]) {
    return data.map((item) => {
      const entity = new UserEntity();
      Object.assign(entity, item);
      return entity;
    });
  }

  // Add custom query methods here
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from '@core/repositories/base.abstract.repository';
import { RefreshTokenEntity } from '@databases/postgres/entities/refresh-token.entity';
import { IRefreshTokenRepository } from './interface/refresh-token.repository.interface';

@Injectable()
export class RefreshTokenRepository
  extends BaseAbstractRepository<RefreshTokenEntity>
  implements IRefreshTokenRepository
{
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly repository: Repository<RefreshTokenEntity>,
  ) {
    super(repository);
  }

  createEntity(data: any) {
    const entity = new RefreshTokenEntity();
    Object.assign(entity, data);
    return entity;
  }

  createEntities(data: any) {
    return data.map((item) => {
      const entity = new RefreshTokenEntity();
      Object.assign(entity, item);
      return entity;
    });
  }

  // Add custom query methods here
}

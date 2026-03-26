import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HomestayEntity } from '../databases/postgres/entities/homestay.entity';
import { IHomestayRepository } from './interface/homestay.repository.interface';
import { BaseAbstractRepository } from '@core/repositories/base.abstract.repository';

@Injectable()
export class HomestayRepository
  extends BaseAbstractRepository<HomestayEntity>
  implements IHomestayRepository
{
  constructor(
    @InjectRepository(HomestayEntity)
    private readonly repository: Repository<HomestayEntity>,
  ) {
    super(repository);
  }

  createEntity(data: any) {
    const entity = new HomestayEntity();
    Object.assign(entity, data);
    return entity;
  }

  createEntities(data: any) {
    return data.map((item) => {
      const entity = new HomestayEntity();
      Object.assign(entity, item);
      return entity;
    });
  }

  // Add custom query methods here
}

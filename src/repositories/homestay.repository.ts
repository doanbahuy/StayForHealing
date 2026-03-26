import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HomestayEntity } from '../databases/postgres/entities/homestay.entity';
import { IHomestayRepository } from './interface/homestay.repository.interface';

@Injectable()
export class HomestayRepository implements IHomestayRepository {
  constructor(
    @InjectRepository(HomestayEntity)
    private readonly repository: Repository<HomestayEntity>,
  ) {}

  createEntity(data: any) {
    const entity = new HomestayEntity();
    Object.assign(entity, data);
    return entity;
  }

  createEntities(data: any[]) {
    return data.map((item) => {
      const entity = new HomestayEntity();
      Object.assign(entity, item);
      return entity;
    });
  }

  // Add custom query methods here
}

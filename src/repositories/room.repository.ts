import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from '../databases/postgres/entities/room.entity';
import { IRoomRepository } from './interface/room-repository.interface';

@Injectable()
export class RoomRepository implements IRoomRepository {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly repository: Repository<RoomEntity>,
  ) {}

  createEntity(data: any) {
    const entity = new RoomEntity();
    Object.assign(entity, data);
    return entity;
  }

  createEntities(data: any[]) {
    return data.map((item) => {
      const entity = new RoomEntity();
      Object.assign(entity, item);
      return entity;
    });
  }

  // Add custom query methods here
}

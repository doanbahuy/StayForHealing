import { HomestayEntity } from '../../databases/postgres/entities/homestay.entity';

export interface IHomestayRepository {
  createEntity(data: any): HomestayEntity;
  createEntities(data: any[]): HomestayEntity[];
  // Add custom query method signatures here
}

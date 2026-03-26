import { RoomEntity } from '../../databases/postgres/entities/room.entity';

export interface IRoomRepository {
  createEntity(data: any): RoomEntity;
  createEntities(data: any[]): RoomEntity[];
  // Add custom query method signatures here
}

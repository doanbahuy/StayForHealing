import { InjectRepository } from '@nestjs/typeorm';
import { IRoomService } from './interface/room.service.interface';
import { RoomEntity } from '@databases/postgres/entities/room.entity';
import { Repository } from 'typeorm';

export class RoomService implements IRoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {}
  private async getRooms(): Promise<any> {}
  private async getRoomById(): Promise<any> {}
  private async createRoom(): Promise<any> {}
  private async updateRoom(): Promise<any> {}
  private async deleteRoom(): Promise<any> {}
}

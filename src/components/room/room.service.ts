import { InjectRepository } from '@nestjs/typeorm';
import { IRoomService } from './interface/room.service.interface';
import { RoomEntity } from '@databases/postgres/entities/room.entity';
import { Repository } from 'typeorm';
import { RoomResponseDto } from './dto/response/room.response.dto';

export class RoomService implements IRoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {}
  async getRooms(): Promise<RoomResponseDto[]> {
    
  }
  async getRoomById(): Promise<RoomResponseDto> {}
  async createRoom(): Promise<RoomResponseDto> {}
  async updateRoom(): Promise<RoomResponseDto> {}
  async deleteRoom(): Promise<RoomResponseDto> {}
}

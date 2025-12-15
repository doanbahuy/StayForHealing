import { CreateRoomRequestDto } from '../dto/request/create-room.request.dto';
import { RoomResponseDto } from '../dto/response/room.response.dto';
import { ResponsePayload } from '@utils/response-payload';

export interface IRoomService {
  getRooms(filter?: any): Promise<ResponsePayload<RoomResponseDto[]>>;
  getRoomById(id: string): Promise<RoomResponseDto>;
  createRoom(
    request: CreateRoomRequestDto,
  ): Promise<ResponsePayload<RoomResponseDto>>;
  updateRoom(id: string, data: any): Promise<RoomResponseDto>;
  deleteRoom(id: string): Promise<RoomResponseDto>;
}

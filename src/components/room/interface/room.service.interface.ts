import { CreateRoomRequestDto } from '../dto/request/create-room.request.dto';
import { UpdateRoomRequestDto } from '../dto/request/update-room.request.dto';
import { RoomResponseDto } from '../dto/response/room.response.dto';
import { ResponsePayload } from '@utils/response-payload';

export interface IRoomService {
  getRooms(filter?: any): Promise<ResponsePayload<RoomResponseDto[]>>;
  getRoomById(id: number): Promise<ResponsePayload<RoomResponseDto>>;
  createRoom(
    request: CreateRoomRequestDto,
  ): Promise<ResponsePayload<RoomResponseDto>>;
  updateRoom(
    id: number,
    data: UpdateRoomRequestDto,
  ): Promise<ResponsePayload<RoomResponseDto>>;
  deleteRoom(id: number): Promise<ResponsePayload<RoomResponseDto>>;
}

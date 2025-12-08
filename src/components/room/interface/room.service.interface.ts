import { RoomResponseDto } from "../dto/response/room.response.dto";

export interface IRoomService {
  getRooms(): Promise<RoomResponseDto[]>;
  getRoomById(id: string): Promise<RoomResponseDto>;
  createRoom(data: any): Promise<RoomResponseDto>;
  updateRoom(id: string, data: any): Promise<RoomResponseDto>;
  deleteRoom(id: string): Promise<RoomResponseDto>;
}

export class IRoomService{
    getRooms(): Promise<any>;
    getRoomById(id: string): Promise<any>;
    createRoom(data: any): Promise<any>;
    updateRoom(id: string, data: any): Promise<any>;
    deleteRoom(id: string): Promise<any>;
}

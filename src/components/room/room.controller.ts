/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query } from '@nestjs/common';
import { IRoomService } from './interface/room.service.interface';
import { CreateRoomRequestDto } from './dto/request/create-room.request.dto';

@Controller('rooms')
export class RoomController {
  constructor(
    @Inject('IRoomService')
    private readonly roomService: IRoomService,
  ) {}

  @Get('')
  async getRooms(@Query() filter: any,): Promise<any> {
    return await this.roomService.getRooms(filter);
  }

  @Get('/search/:id')
  async getRoomById(@Param() id: string): Promise<any> {
    return await this.getRoomById(id);
  }

  @Post('')
  async createRoom(@Body() body:CreateRoomRequestDto): Promise<any> {
    return await this.roomService.createRoom(body);
  }

  @Put(':id')
  async updateRoom(@Param() id: string, @Body() body:any,): Promise<any> {
    return await this.roomService.updateRoom(id, body);
  }

  @Delete(':id')
  async deleteRoom(@Param() id: string,): Promise<any> {
    return await this.roomService.deleteRoom(id);
  }
}

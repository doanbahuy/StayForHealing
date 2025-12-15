/* eslint-disable @typescript-eslint/no-explicit-any */
import { InjectRepository } from '@nestjs/typeorm';
import { IRoomService } from './interface/room.service.interface';
import { RoomEntity } from '@databases/postgres/entities/room.entity';
import { Repository } from 'typeorm';
import { RoomResponseDto } from './dto/response/room.response.dto';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { plainToInstance } from 'class-transformer';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { CreateRoomRequestDto } from './dto/request/create-room.request.dto';
import { HomestayEntity } from '@databases/postgres/entities/homestay.entity';

export class RoomService implements IRoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    @InjectRepository(HomestayEntity)
    private readonly homestayRepository: Repository<HomestayEntity>,
  ) {}
  async getRooms(filter: any): Promise<ResponsePayload<RoomResponseDto[]>> {
    if (filter) {
      const page = Number(filter.page) || 1;
      const limit = Number(filter.limit) || 10;

      const order: Record<string, 'ASC' | 'DESC'> = {};

      if (filter.sort) {
        JSON.parse(filter.sort).forEach(
          (s: { column: string; order: string }) => {
            order[s.column] = s.order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
          },
        );
      }

      const roomEntity = await this.roomRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        order: order,
      });

      const room = plainToInstance(RoomResponseDto, roomEntity, {
        excludeExtraneousValues: true,
      });

      return new ResponseBuilder(room)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage('Success')
        .build();
    }
  }
  async getRoomById(): Promise<RoomResponseDto> {
    return;
  }

  async createRoom(
    request: CreateRoomRequestDto,
  ): Promise<ResponsePayload<RoomResponseDto>> {
    const { homeOwner } = request;
    const home = await this.homestayRepository.findOne({
      where: { id: homeOwner },
      relations: ['owner'],
    });
    const roomEntity = this.roomRepository.create({
      ...request,
      home: home,
    });
    await this.roomRepository.save(roomEntity);

    const room = plainToInstance(RoomResponseDto, roomEntity, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(room)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('Room created successfully')
      .build();
  }

  async updateRoom(): Promise<RoomResponseDto> {
    return;
  }
  async deleteRoom(): Promise<RoomResponseDto> {
    return;
  }
}

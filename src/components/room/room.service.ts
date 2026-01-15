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
import { UpdateRoomRequestDto } from './dto/request/update-room.request.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RabbitMQService } from '@core/components/message-queue/rabbitmq.service';

export class RoomService implements IRoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    @InjectRepository(HomestayEntity)
    private readonly homestayRepository: Repository<HomestayEntity>,
    private readonly mq: RabbitMQService,
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
  async getRoomById(id: number): Promise<ResponsePayload<RoomResponseDto>> {
    const room = await this.roomRepository.findOne({ where: { id: id } });
    if (!room) throw new NotFoundException('Room not found!');

    return new ResponseBuilder(
      plainToInstance(RoomResponseDto, room, {
        excludeExtraneousValues: true,
      }),
    )
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('Success')
      .build();
  }

  async createRoom(
    request: CreateRoomRequestDto,
  ): Promise<ResponsePayload<RoomResponseDto>> {
    const { homeOwner } = request;
    const home = await this.homestayRepository.findOne({
      where: { id: homeOwner },
      relations: ['owner'],
    });
    if (!home) {
      throw new NotFoundException('Homestay owner is missing!');
    }
    const roomEntity = await this.roomRepository.create({
      ...request,
      roomCode: home.title + '_' + request.roomCode,
      home: home,
    });
    try {
      await this.roomRepository.save(roomEntity);
    } catch {
      throw new BadRequestException('Room code exist!');
    }
    await this.mq.publish('email_exchange', 'email.send', {
      to: home.owner.id,
      subject: `Room ${roomEntity.roomCode} created`,
    });
    const room = plainToInstance(RoomResponseDto, roomEntity, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(room)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('Room created successfully')
      .build();
  }

  async updateRoom(
    id: number,
    data: UpdateRoomRequestDto,
  ): Promise<ResponsePayload<RoomResponseDto>> {
    const room = await this.roomRepository.preload({
      id,
      ...data,
    });

    if (!room) throw new NotFoundException('Room not found!');
    await this.roomRepository.save(room);

    return new ResponseBuilder(
      plainToInstance(RoomResponseDto, room, {
        excludeExtraneousValues: true,
      }),
    )
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('Success')
      .build();
  }
  async deleteRoom(id: number): Promise<ResponsePayload<RoomResponseDto>> {
    const room = await this.roomRepository.findOne({ where: { id: id } });
    if (!room) throw new NotFoundException('Room not found!');

    if (room.status === 0) {
      throw new BadRequestException('Room already deleted!');
    }
    room.status = 0;
    await this.roomRepository.save(room);

    return new ResponseBuilder(
      plainToInstance(RoomResponseDto, room, {
        excludeExtraneousValues: true,
      }),
    )
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('Room deleted successfully')
      .build();
  }
}

/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { InjectRepository } from '@nestjs/typeorm';
import { IHomestayService } from './interface/homestay.service.interface';
import { HomestayEntity } from '@databases/postgres/entities/homestay.entity';
import { Repository } from 'typeorm';
import { CreateHomestayRequestDto } from './dto/request/create-homestay.request.dto';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from '@databases/postgres/entities/user.entity';
import { HomestayResponseDto } from './dto/response/homestay.response.dto';
import { StatusEnum } from '@constant/common';
import { RoomEntity } from '@databases/postgres/entities/room.entity';
import { ResponsePayload } from '@utils/response-payload';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { AccountEntity } from '@databases/postgres/entities/account.entity';
import { HomestayRepository } from '@repositories/homestay.repository';

export class HomestayService implements IHomestayService {
  constructor(
    @Inject('IHomestayRepository')
    private readonly homestayRepository: HomestayRepository,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,

    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {}

  async getHomestay(filter: any): Promise<any> {
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

      const homestayEntity = await this.homestayRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        order: order,
        where: { status: 1 },
        relations: ['owner'],
      });

      const homestay = plainToInstance(HomestayResponseDto, homestayEntity, {
        excludeExtraneousValues: true,
      });

      return new ResponseBuilder(homestay)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage('Success')
        .build();
    }
  }

  async getHomestayById(params): Promise<any> {
    const { id } = params;
    const homestayEntity = await this.homestayRepository.findOneByCondition({
      where: {
        id,
        status: 1,
      },
    });

    if (!homestayEntity) {
      throw new NotFoundException('Homestay not found');
    }

    const homestay = plainToInstance(HomestayResponseDto, homestayEntity, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(homestay)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('Success')
      .build();
  }

  async createHomestay(req: any, body: CreateHomestayRequestDto): Promise<any> {
    const { user } = req.user;
    const homestayEntity = {
      description: body.description,
      address: body.address,
      title: body.title,
      owner: user,
    };

    if (await this.__existHomestay(body.title, user)) {
      throw new BadRequestException('Homestay existed!');
    }

    // console.log(homestayEntity);

    await this.homestayRepository.create(homestayEntity);

    return new ResponseBuilder(
      plainToInstance(HomestayResponseDto, homestayEntity, {
        excludeExtraneousValues: true,
      }),
    )
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('Success')
      .build();
  }

  async updateHomestay(): Promise<any> {}

  async deleteHomestay(
    id: number,
  ): Promise<ResponsePayload<HomestayResponseDto>> {
    const homestayEntity = await this.homestayRepository.findOneByCondition({
      where: { id },
    });

    if (!homestayEntity || homestayEntity.status === StatusEnum.INACTIVE) {
      return new ResponseBuilder(null)
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage('Homestay not found')
        .build();
    }
    homestayEntity.status = StatusEnum.INACTIVE;

    const rooms = await this.roomRepository.find({ where: { home: { id } } });

    for (const room of rooms) {
      room.status = StatusEnum.INACTIVE;
      await this.roomRepository.save(room);
    }

    await this.homestayRepository.create(homestayEntity);

    return new ResponseBuilder(
      plainToInstance(HomestayResponseDto, homestayEntity),
    )
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('Delete success')
      .build();
  }

  private async __existHomestay(title: string, ownerId: number) {
    const homestayExist = await this.homestayRepository.findOneByCondition({
      where: { title: title, owner: ownerId },
    });
    if (homestayExist != null) return true;
    return false;
  }
}

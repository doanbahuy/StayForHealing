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
import { CustomerEntity } from '@databases/postgres/entities/customer.entity';
import { HomestayResponseDto } from './dto/response/homestay.response.dto';

export class HomestayService implements IHomestayService {
  constructor(
    @InjectRepository(HomestayEntity)
    private readonly homestayRepository: Repository<HomestayEntity>,
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}
  async getHomestays(filter: any): Promise<any> {
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
    const homestayEntity = await this.homestayRepository.findOne({
      where: { id },
    });

    const homestay = plainToInstance(HomestayResponseDto, homestayEntity, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(homestay)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('Success')
      .build();
  } 

  async createHomestay(request: CreateHomestayRequestDto): Promise<any> {
    const { owner } = request;
    const homestayEntity = this.homestayRepository.create(HomestayEntity);

    homestayEntity.description = request.description;
    homestayEntity.address = request.address;
    homestayEntity.title = request.title;
    homestayEntity.owner = await this.customerRepository.findOne({ where: { id: owner } });

    if(!homestayEntity.owner){
      return new ResponseBuilder(null)
      .withCode(ResponseCodeEnum.BAD_REQUEST)
      .withMessage('Owner not found')
      .build();
    }
    
    await this.homestayRepository.save(homestayEntity);

    const homestay = plainToInstance(HomestayResponseDto, homestayEntity, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(homestay)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('Success')
      .build();

  }
  async updateHomestay(): Promise<any> {}
  async deleteHomestay(): Promise<any> {}
}

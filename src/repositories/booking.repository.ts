import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingEntity } from '../databases/postgres/entities/booking.entity';
import { IBookingRepository } from './interface/booking-repository.interface';
import { BaseAbstractRepository } from '@core/repositories/base.abstract.repository';

@Injectable()
export class BookingRepository
  extends BaseAbstractRepository<BookingEntity>
  implements IBookingRepository
{
  constructor(
    @InjectRepository(BookingEntity)
    private readonly repository: Repository<BookingEntity>,
  ) {
    super(repository);
  }

  createEntity(data: any) {
    const entity = new BookingEntity();
    Object.assign(entity, data);
    return entity;
  }

  createEntities(data: any) {
    return data.map((item: any) => {
      const entity = new BookingEntity();
      Object.assign(entity, item);
      return entity;
    });
  }

  // Add custom query methods here
}

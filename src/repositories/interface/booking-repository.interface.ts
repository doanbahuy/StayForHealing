import { BaseAbstractRepository } from '@core/repositories/base.abstract.repository';
import { BookingEntity } from '../../databases/postgres/entities/booking.entity';

export interface IBookingRepository extends BaseAbstractRepository<BookingEntity> {
  createEntity(data: any);
  createEntities(data: any[]);
  // Add custom query method signatures here
}

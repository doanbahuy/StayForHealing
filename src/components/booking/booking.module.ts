import { BookingEntity } from '@databases/postgres/entities/booking.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { RoomEntity } from '@databases/postgres/entities/room.entity';
import { AccountEntity } from '@databases/postgres/entities/account.entity';
import { BookingRepository } from '@repositories/booking.repository';
import { UserEntity } from '@databases/postgres/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookingEntity, RoomEntity, UserEntity])],
  providers: [
    {
      provide: 'IBookingService',
      useClass: BookingService,
    },
    {
      provide: 'IBookingRepository',
      useClass: BookingRepository,
    },
  ],
  controllers: [BookingController],
  exports: [
    {
      provide: 'IBookingService',
      useClass: BookingService,
    },
  ],
})
export class BookingModule {}

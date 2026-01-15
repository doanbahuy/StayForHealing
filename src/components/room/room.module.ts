import { HomestayService } from '@components/homestay/homestay.service';
import { HomestayEntity } from '@databases/postgres/entities/homestay.entity';
import { RoomEntity } from '@databases/postgres/entities/room.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { UserEntity } from '@databases/postgres/entities/user.entity';
import { AccountEntity } from '@databases/postgres/entities/account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoomEntity,
      HomestayEntity,
      AccountEntity,
      UserEntity,
    ]),
  ],
  providers: [
    {
      provide: 'IRoomService',
      useClass: RoomService,
    },
    {
      provide: 'IHomestayService',
      useClass: HomestayService,
    },
  ],
  exports: [],
  controllers: [RoomController],
})
export class RoomModule {}

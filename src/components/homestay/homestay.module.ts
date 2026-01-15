import { UserService } from '@components/user/user.service';
import { HomestayEntity } from '@databases/postgres/entities/homestay.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { HomestayService } from './homestay.service';
import { HomestayController } from './homestay.controller';
import { UserEntity } from '@databases/postgres/entities/user.entity';
import { AccountEntity } from '@databases/postgres/entities/account.entity';
import { RoomEntity } from '@databases/postgres/entities/room.entity';
import { CacheModule } from '@core/components/cache/cache.module';
import { CacheService } from '@core/components/cache/cache.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HomestayEntity,
      UserEntity,
      AccountEntity,
      RoomEntity,
    ]),
    CacheModule,
  ],
  providers: [
    {
      provide: 'IUserService',
      useClass: UserService,
    },
    {
      provide: 'IHomestayService',
      useClass: HomestayService,
    },
  ],
  exports: [
    {
      provide: 'IHomestayService',
      useClass: HomestayService,
    },
  ],
  controllers: [HomestayController],
})
export class HomestayModule {}

import { Module } from '@nestjs/common';
import { UserService } from '@components/user/user.service';
import { UserController } from '@components/user/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@databases/postgres/entities/user.entity';
import { AccountEntity } from '@databases/postgres/entities/account.entity';
import { CacheService } from '@core/components/cache/cache.service';
import { CacheModule } from '@core/components/cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, AccountEntity])],
  providers: [
    {
      provide: 'IUserService',
      useClass: UserService,
    },
  ],
  controllers: [UserController],
  exports: [
    {
      provide: 'IUserService',
      useClass: UserService,
    },
  ],
})
export class UserModule {}

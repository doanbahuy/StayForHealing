import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '@components/user/user.module';
import { AccountEntity } from '@databases/postgres/entities/account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from '@databases/postgres/entities/refresh-token.entity';
import { AccountRepository } from '@repositories/account.repository';
import { RefreshTokenRepository } from '@repositories/refresh-token.repository';

@Module({
  imports: [
    HttpModule,
    UserModule,
    TypeOrmModule.forFeature([AccountEntity, RefreshTokenEntity]),
  ],
  providers: [
    {
      provide: 'IAuthService',
      useClass: AuthService,
    },
    {
      provide: 'IAccountRepository',
      useClass: AccountRepository,
    },
    {
      provide: 'IRefreshTokenRepository',
      useClass: RefreshTokenRepository,
    },
  ],
  exports: [
    {
      provide: 'IAuthService',
      useClass: AuthService,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { UserService } from '@components/user/user.service';
import { UserController } from '@components/user/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/databases/postgres/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [
        {
            provide: 'IUserService',
            useClass: UserService,
        },
    ],
    controllers: [UserController],
})
export class UserModule {}

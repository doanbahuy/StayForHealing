import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserService } from './interface/user.service.interface';
import { CreateUserRequestDto } from './dto/request/create-user.request.dto';
import { UpdateUserRequestDto } from './dto/request/update-user.request.dto';
import { User } from 'src/databases/postgres/entities/user.entity';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(request: CreateUserRequestDto) {
    const user = this.userRepository.create(request);
    user.code = await this.__createCustomerCode();
    return this.userRepository.save(user);
  }

  async getUsers() {
    return this.userRepository.find();
  }

  async updateUser(id: string, dto: UpdateUserRequestDto) {
    return await this.userRepository.update(id, dto);
  }

  async deleteUser(id: string) {
    return this.userRepository.delete(id);
  }

  private async __createCustomerCode(): Promise<string> {
    const lastUser = await this.userRepository.findOne({
      order: { id: 'DESC' },
    });
    const lastCodeNumber = lastUser
      ? parseInt(lastUser.code.slice(3))
      : 0;
    const newCodeNumber = lastCodeNumber + 1;
    return `KH${newCodeNumber.toString().padStart(Math.round(newCodeNumber/10) + 2, '0')}`;
  }
}

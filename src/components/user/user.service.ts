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
    return this.userRepository.save(user);
  }

  async getUsers() {
    return this.userRepository.find();
  }

  async getUserById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async updateUser(id: number, dto: UpdateUserRequestDto) {
    await this.userRepository.update(id, dto);
    return this.getUserById(id);
  }

  async deleteUser(id: number) {
    return this.userRepository.delete(id);
  }
}

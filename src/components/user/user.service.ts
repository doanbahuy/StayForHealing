import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { IUserService } from './interface/user.service.interface';
import { CreateUserRequestDto } from './dto/request/create-user.request.dto';
import { UpdateUserRequestDto } from './dto/request/update-user.request.dto';
import { UserEntity } from 'src/databases/postgres/entities/user.entity';
import { ResponseBuilder } from '@utils/response-builder';
import { plainToInstance } from 'class-transformer';
import { UsersResponseDto } from './dto/response/users.response.dto';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { ResponsePayload } from '@utils/response-payload';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // ====================== CREATE ==========================
  async createUser(
    request: CreateUserRequestDto,
  ): Promise<ResponsePayload<UsersResponseDto>> {
    // 1. Entity
    const userEntity = this.userRepository.create(request);

    userEntity.customerCode = await this.__createCustomerCode();
    userEntity.status = 1;

    await this.userRepository.save(userEntity);

    // 2. Convert Entity → DTO
    const user = plainToInstance(UsersResponseDto, userEntity, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(user)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('Success')
      .build();
  }

  // ====================== GET ALL ==========================
  async getUsers(): Promise<ResponsePayload<UsersResponseDto[]>> {
    const usersEntity = await this.userRepository.find({
      where: { status: 1 },
    });

    const users = plainToInstance(UsersResponseDto, usersEntity, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(users)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('Success')
      .build();
  }

  // ====================== GET BY ID ==========================
  async getUserById(params) {
    const { id } = params;

    const userEntity = await this.userRepository.findOne({ where: { id } });

    const user = plainToInstance(UsersResponseDto, userEntity, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(user)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('Success')
      .build();
  }

  // ====================== SEARCH BY NAME ==========================
  async getUsersByName(params) {
    const { username } = params;

    const userEntity = await this.userRepository.find({
      where: { username: Like(`%${username}%`) },
    });

    const users = plainToInstance(UsersResponseDto, userEntity, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(users)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('Success')
      .withData(users)
      .build();
  }

  // ====================== UPDATE ==========================
  async updateUser(
    params,
    payload: UpdateUserRequestDto,
  ): Promise<ResponsePayload<UsersResponseDto>> {
    const { id } = params;
    const userEntity = await this.userRepository.findOne({ where: { id } });

    if (!userEntity) throw new Error('User not found');

    userEntity.username = payload.username;

    await this.userRepository.save(userEntity);

    const user = plainToInstance(UsersResponseDto, userEntity, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(user)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('Success')
      .build();
  }

  // ====================== SOFT DELETE ==========================
  async deleteUser(params): Promise<ResponsePayload<UsersResponseDto>> {
    const { id } = params;

    const userEntity = await this.userRepository.findOne({ where: { id } });

    userEntity.status = 0; // status: number

    await this.userRepository.save(userEntity);

    const user = plainToInstance(UsersResponseDto, userEntity, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(user)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('Success')
      .build();
  }

  // ====================== AUTO CODE ==========================
  private async __createCustomerCode(): Promise<string> {
    const lastUser = await this.userRepository.findOne({
      order: { id: 'DESC' },
    });

    const lastCode = lastUser?.customerCode ?? 'KH000';

    const lastNumber = parseInt(lastCode.replace('KH', '')) || 0;

    const newCode = `KH${(lastNumber + 1).toString().padStart(3, '0')}`;

    return newCode;
  }
}

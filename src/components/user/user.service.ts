import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserService } from './interface/user.service.interface';
import { CreateUserRequestDto } from './dto/request/create-user.request.dto';
import { UpdateUserRequestDto } from './dto/request/update-user.request.dto';
import { ResponseBuilder } from '@utils/response-builder';
import { plainToInstance } from 'class-transformer';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { ResponsePayload } from '@utils/response-payload';
import { UsersResponseDto } from './dto/response/user.response.dto';
import { UserEntity } from '@databases/postgres/entities/user.entity';
import { AccountEntity } from '@databases/postgres/entities/account.entity';
import { CacheService } from '@core/components/cache/cache.service';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly cacheService: CacheService,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(AccountEntity)
    private readonly authRepository: Repository<AccountEntity>,
  ) {}

  // ====================== CREATE ==========================
  async createUser(
    request: CreateUserRequestDto,
  ): Promise<ResponsePayload<UsersResponseDto>> {
    // 1. Entity
    const userEntity = this.userRepository.create(request);

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
  async getUsers(filter: any): Promise<ResponsePayload<UsersResponseDto[]>> {
    const page = Number(filter?.page) || 1;
    const limit = Number(filter?.limit) || 10;

    const cacheKey = `users:list:page=${page}:limit=${limit}`;

    const cached = await this.cacheService.getCache(cacheKey);

    if (cached) {
      return cached;
    }

    const order: Record<string, 'ASC' | 'DESC'> = {};
    if (filter?.sort) {
      JSON.parse(filter.sort).forEach(
        (s: { column: string; order: string }) => {
          order[s.column] = s.order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        },
      );
    }

    const [entities] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order,
    });

    const users = plainToInstance(UsersResponseDto, entities, {
      excludeExtraneousValues: true,
    });

    await this.cacheService.setCache('users:list', users, 60);

    const response = new ResponseBuilder(users)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('Success')
      .build();

    await this.cacheService.setCache(cacheKey, response, 30);

    return response;
  }

  // ====================== GET BY ID ==========================
  async getUserById(params) {
    const { id } = params;

    const userEntity = await this.userRepository.findOne({
      where: { id },
    });

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
    const { userName } = params;

    const userEntity = await this.userRepository
      .createQueryBuilder('user')
      .where(`unaccent(lower(user.userName)) LIKE unaccent(lower(:name))`, {
        name: `%${userName}%`,
      })
      .getMany();

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
    const userEntity = await this.userRepository.findOne({
      where: { id },
    });

    if (!userEntity) throw new Error('User not found');

    userEntity.fullName = payload.fullName;

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

    const userEntity = await this.userRepository.findOne({
      where: { id },
    });

    await this.userRepository.save(userEntity);

    const user = plainToInstance(UsersResponseDto, userEntity, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(user)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('Success')
      .build();
  }
}

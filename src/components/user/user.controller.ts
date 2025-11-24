import {
  Controller,
  Get,
  Inject,
  Post,
  Delete,
  Put,
  Param,
  Body,
} from '@nestjs/common';
import { IUserService } from '@components/user/interface/user.service.interface';
import { CreateUserRequestDto } from './dto/request/create-user.request.dto';
import { UpdateUserRequestDto } from './dto/request/update-user.request.dto';
import { ResponsePayload } from '@utils/response-payload';
import { UsersResponseDto } from './dto/response/users.response.dto';

@Controller('users')
export class UserController {
  constructor(
    @Inject('IUserService')
    private readonly userService: IUserService,
  ) {}

  @Post('')
  async createUser(
    @Body() body: CreateUserRequestDto,
  ): Promise<ResponsePayload<UsersResponseDto>> {
    return this.userService.createUser(body);
  }

  @Get('')
  async getUsers(): Promise<ResponsePayload<UsersResponseDto[]>> {
    return this.userService.getUsers();
  }

  @Get('/detail/:id')
  async getUserById(
    @Param() params: string,
  ): Promise<ResponsePayload<UsersResponseDto>> {
    return this.userService.getUserById(params);
  }

  @Get('/find/:username')
  async getUsersByName(
    @Param() params: string,
  ): Promise<ResponsePayload<UsersResponseDto[]>> {
    return this.userService.getUsersByName(params);
  }

  @Delete(':id')
  async deleteUser(
    @Param() id: string,
  ): Promise<ResponsePayload<UsersResponseDto>> {
    return this.userService.deleteUser(id);
  }

  @Put(':id')
  async updateUser(
    @Param() id: string,
    @Body() body: UpdateUserRequestDto,
  ): Promise<ResponsePayload<UsersResponseDto>> {
    return this.userService.updateUser(id, body);
  }
}

import {
  Controller,
  Get,
  Inject,
  Post,
  Delete,
  Put,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { IUserService } from '@components/user/interface/user.service.interface';
import { CreateUserRequestDto } from './dto/request/create-user.request.dto';
import { UpdateUserRequestDto } from './dto/request/update-user.request.dto';
import { ResponsePayload } from '@utils/response-payload';
import { UsersResponseDto } from './dto/response/user.response.dto';
import { Roles } from '@core/decorator/roles';
import { RoleEnum } from '@constant/common';
import { Public } from '@core/decorator/set-public.decorator';

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

  // @Roles(RoleEnum.ADMIN)
  @Public()
  @Get('')
  async getUsers(
    @Query() filter: any,
  ): Promise<ResponsePayload<UsersResponseDto[]>> {
    return this.userService.getUsers(filter);
  }

  @Get('/detail/:id')
  async getUserById(
    @Param() params: string,
  ): Promise<ResponsePayload<UsersResponseDto>> {
    return this.userService.getUserById(params);
  }

  @Get('/search/:userName')
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

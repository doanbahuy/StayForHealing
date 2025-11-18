import { Controller, Get, Inject, Post, Delete, Put, Param, Body } from '@nestjs/common';
import { IUserService } from '@components/user/interface/user.service.interface';
import { CreateUserRequestDto } from './dto/request/create-user.request.dto';
import { UpdateUserRequestDto } from './dto/request/update-user.request.dto';

@Controller('users')
export class UserController {
  constructor(
    @Inject('IUserService')
    private readonly userService: IUserService,
  ) {}

  @Post('')
  async createUser(@Body() body: CreateUserRequestDto): Promise<any> {
    return this.userService.createUser(body);
  }

  @Get('')
  async getUser(): Promise<string> {
    return this.userService.getUsers();
  }

  @Delete(':id')
  async deleteUser(@Param() id:number): Promise<any>{
    return this.userService.deleteUser(id);
  }

  @Put(':id')
  async updateUser(
    @Param() id:number,
    @Body() body: UpdateUserRequestDto
  ): Promise<any>{
    return this.userService.updateUser(id, body);
  }
}
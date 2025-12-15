/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { IHomestayService } from './interface/homestay.service.interface';
import { CreateHomestayRequestDto } from './dto/request/create-homestay.request.dto';
import { RateLimit } from '@core/decorator/rate-limit.decorator';
import { Roles } from '@core/decorator/roles';
import { RoleEnum } from '@constant/common';

@Controller('homestay')
export class HomestayController {
  constructor(
    @Inject('IHomestayService')
    private readonly homestayService: IHomestayService,
  ) {}

  @Get('')
  async getHomestays(@Query() filter: any): Promise<any> {
    return await this.homestayService.getHomestays(filter);
  }

  @Get('/search/:id')
  async getHomestayById(@Query('id', ParseIntPipe) id: number): Promise<any> {
    return await this.homestayService.getHomestayById(id);
  }

  @RateLimit({ window: 10000, max: 5 })
  @Roles(RoleEnum.HOST)
  @Post('')
  async createHomestay(@Body() body: any): Promise<any> {
    return await this.homestayService.createHomestay(body);
  }

  @Put('/:id')
  async updateHomestay(@Param() id: number, @Body() body: any): Promise<any> {
    return await this.homestayService.updateHomestay(id, body);
  }

  @Delete('/:id')
  async deleteHomestay(@Query('id', ParseIntPipe) id: number): Promise<any> {
    return await this.homestayService.deleteHomestay(id);
  }
}

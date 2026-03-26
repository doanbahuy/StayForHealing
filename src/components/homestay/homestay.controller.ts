import { CreateHomestayRequestDto } from './dto/request/create-homestay.request.dto';
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
  Req,
} from '@nestjs/common';
import { IHomestayService } from './interface/homestay.service.interface';
import { RateLimit } from '@core/decorator/rate-limit.decorator';
import { Roles } from '@core/decorator/roles';
import { RoleEnum } from '@constant/common';
import { Public } from '@core/decorator/set-public.decorator';

@Controller('homestay')
export class HomestayController {
  constructor(
    @Inject('IHomestayService')
    private readonly homestayService: IHomestayService,
  ) {}

  @Public()
  @Get('')
  async getHomestay(@Query() filter: any): Promise<any> {
    return await this.homestayService.getHomestay(filter);
  }

  @Get('/search/:id')
  async getHomestayById(@Query('id', ParseIntPipe) id: number): Promise<any> {
    return await this.homestayService.getHomestayById(id);
  }

  @RateLimit({ window: 10000, max: 5 })
  @Roles(RoleEnum.HOST)
  @Post('')
  async createHomestay(
    @Req() req: any,
    @Body() body: CreateHomestayRequestDto,
  ): Promise<any> {
    return await this.homestayService.createHomestay(req, body);
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

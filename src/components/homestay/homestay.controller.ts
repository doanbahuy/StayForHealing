/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { IHomestayService } from './interface/homestay.service.interface';
import { CreateHomestayRequestDto } from './dto/request/create-homestay.request.dto';

@Controller('homestay')
export class HomestayController {
    constructor(
        @Inject('IHomestayService')
        private readonly homestayService: IHomestayService,
    ){}

  @Get('')
  async getHomestays( @Query() filter: any,): Promise<any> {
    return await this.homestayService.getHomestays(filter);
  }

  @Get('/search/:id')
  async getHomestayById(@Param() id: string): Promise<any> {
    return await this.getHomestayById(id);
  }

  @Post('')
  async createHomestay(@Body() body:CreateHomestayRequestDto,): Promise<any> {
    return await this.homestayService.createHomestay(body);
  }

  @Put(':id')
  async updateHomestay(@Param() id: string, @Body() body:any,): Promise<any> {
    return await this.homestayService.updateHomestay(id, body);
  }

  @Delete(':id')
  async deleteHomestay(@Param() id: string,): Promise<any> {
    return await this.homestayService.deleteHomestay(id);
  }
}
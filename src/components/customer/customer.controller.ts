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
import { ICustomerService } from '@components/customer/interface/customer.service.interface';
import { CreateCustomerRequestDto } from './dto/request/create-customer.request.dto';
import { UpdateCustomerRequestDto } from './dto/request/update-customer.request.dto';
import { ResponsePayload } from '@utils/response-payload';
import { CustomersResponseDto } from './dto/response/customer.response.dto';
import { PaginationQuery } from '@utils/pagination.query';

@Controller('customers')
export class CustomerController {
  constructor(
    @Inject('ICustomerService')
    private readonly customerService: ICustomerService,
  ) {}

  @Post('')
  async createCustomer(
    @Body() body: CreateCustomerRequestDto,
  ): Promise<ResponsePayload<CustomersResponseDto>> {
    return this.customerService.createCustomer(body);
  }

  @Get('')
  async getCustomers(
    @Query() filter: any,
  ): Promise<ResponsePayload<CustomersResponseDto[]>> {
    return this.customerService.getCustomers(filter);
  }

  @Get('/detail/:id')
  async getCustomerById(
    @Param() params: string,
  ): Promise<ResponsePayload<CustomersResponseDto>> {
    return this.customerService.getCustomerById(params);
  }

  @Get('/search/:customerName')
  async getCustomersByName(
    @Param() params: string,
  ): Promise<ResponsePayload<CustomersResponseDto[]>> {
    return this.customerService.getCustomersByName(params);
  }

  @Delete(':id')
  async deleteCustomer(
    @Param() id: string,
  ): Promise<ResponsePayload<CustomersResponseDto>> {
    return this.customerService.deleteCustomer(id);
  }

  @Put(':id')
  async updateCustomer(
    @Param() id: string,
    @Body() body: UpdateCustomerRequestDto,
  ): Promise<ResponsePayload<CustomersResponseDto>> {
    return this.customerService.updateCustomer(id, body);
  }
}

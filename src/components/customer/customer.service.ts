import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ICustomerService } from './interface/customer.service.interface';
import { CreateCustomerRequestDto } from './dto/request/create-customer.request.dto';
import { UpdateCustomerRequestDto } from './dto/request/update-customer.request.dto';
import { ResponseBuilder } from '@utils/response-builder';
import { plainToInstance } from 'class-transformer';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { ResponsePayload } from '@utils/response-payload';
import { CustomersResponseDto } from './dto/response/customer.response.dto';
import { CustomerEntity } from '@databases/postgres/entities/customer.entity';

@Injectable()
export class CustomerService implements ICustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

  // ====================== CREATE ==========================
  async createCustomer(
    request: CreateCustomerRequestDto,
  ): Promise<ResponsePayload<CustomersResponseDto>> {
    // 1. Entity
    const customerEntity = this.customerRepository.create(request);

    customerEntity.customerCode = await this.__createCustomerCode();

    await this.customerRepository.save(customerEntity);

    // 2. Convert Entity → DTO
    const customer = plainToInstance(CustomersResponseDto, customerEntity, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(customer)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('Success')
      .build();
  }

  // ====================== GET ALL ==========================
  async getCustomers(): Promise<ResponsePayload<CustomersResponseDto[]>> {
    const customersEntity = await this.customerRepository.find({
      where: { status: 1 },
    });

    const customers = plainToInstance(CustomersResponseDto, customersEntity, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(customers)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('Success')
      .build();
  }

  // ====================== GET BY ID ==========================
  async getCustomerById(params) {
    const { id } = params;

    const customerEntity = await this.customerRepository.findOne({
      where: { id },
    });

    const customer = plainToInstance(CustomersResponseDto, customerEntity, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(customer)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('Success')
      .build();
  }

  // ====================== SEARCH BY NAME ==========================
  async getCustomersByName(params) {
    const { customerName } = params;

    const customerEntity = await this.customerRepository
      .createQueryBuilder('customer')
      .where(
        `unaccent(lower(customer.customerName)) LIKE unaccent(lower(:name))`,
        { name: `%${customerName}%` },
      )
      .getMany();

    const customers = plainToInstance(CustomersResponseDto, customerEntity, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(customers)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('Success')
      .withData(customers)
      .build();
  }

  // ====================== UPDATE ==========================
  async updateCustomer(
    params,
    payload: UpdateCustomerRequestDto,
  ): Promise<ResponsePayload<CustomersResponseDto>> {
    const { id } = params;
    const customerEntity = await this.customerRepository.findOne({
      where: { id },
    });

    if (!customerEntity) throw new Error('Customer not found');

    customerEntity.customerName = payload.customerName;

    await this.customerRepository.save(customerEntity);

    const customer = plainToInstance(CustomersResponseDto, customerEntity, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(customer)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('Success')
      .build();
  }

  // ====================== SOFT DELETE ==========================
  async deleteCustomer(params): Promise<ResponsePayload<CustomersResponseDto>> {
    const { id } = params;

    const customerEntity = await this.customerRepository.findOne({
      where: { id },
    });

    customerEntity.status = 0; // status: number

    await this.customerRepository.save(customerEntity);

    const customer = plainToInstance(CustomersResponseDto, customerEntity, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(customer)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('Success')
      .build();
  }

  // ====================== AUTO CODE ==========================
  private async __createCustomerCode(): Promise<string> {
    const lastCustomer = await this.customerRepository.find({
      order: { id: 'DESC' },
      take: 1,
    });

    const lastCode = lastCustomer[0]?.customerCode ?? 'KH000';

    const lastNumber = parseInt(lastCode.replace('KH', '')) || 0;

    const newCode = `KH${(lastNumber + 1).toString().padStart(3, '0')}`;

    return newCode;
  }
}

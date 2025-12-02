import { ResponsePayload } from '@utils/response-payload';
import { CreateCustomerRequestDto } from '../dto/request/create-customer.request.dto';
import { UpdateCustomerRequestDto } from '../dto/request/update-customer.request.dto';
import { CustomersResponseDto } from '../dto/response/customer.response.dto';

export interface ICustomerService {
  validateCustomer(username: string, password: string): any;
  getCustomersByName(
    params: string,
  ):
    | ResponsePayload<CustomersResponseDto[]>
    | PromiseLike<ResponsePayload<CustomersResponseDto[]>>;
  createCustomer(
    body: CreateCustomerRequestDto,
  ): Promise<ResponsePayload<CustomersResponseDto>>;
  getCustomers(filter?: any): Promise<ResponsePayload<CustomersResponseDto[]>>;
  getCustomerById(id: string): Promise<ResponsePayload<CustomersResponseDto>>;
  deleteCustomer(id: string): Promise<ResponsePayload<CustomersResponseDto>>;
  updateCustomer(
    id: string,
    body: UpdateCustomerRequestDto,
  ): Promise<ResponsePayload<CustomersResponseDto>>;
}

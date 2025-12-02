import { RegisterCustomerRequestDto } from "../dto/request/register-customer.request.dto";

export interface IAuthService {
  login(request: any): Promise<any>;
  verifyToken(request: any): Promise<any>;
  refreshToken(token: string): Promise<any>;
  registerCustomer(payload: RegisterCustomerRequestDto): Promise<any>;
}

import { RegisterCustomerRequestDto } from "../dto/request/register-user.request.dto";

export interface IAuthService {
  verifyToken(request: any): Promise<any>;
  refreshToken(token: string): Promise<any>;
  registerCustomer(payload: RegisterCustomerRequestDto): Promise<any>;
}

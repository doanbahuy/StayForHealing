import { LoginRequestDto } from '../dto/request/login.request.dto';
import { RegisterRequestDto } from '../dto/request/register.request.dto';

export interface IAuthService {
  login(request: LoginRequestDto): Promise<any>;
  verifyToken(request: any): Promise<any>;
  refreshToken(token: string): Promise<any>;
  register(payload: RegisterRequestDto): Promise<any>;
}

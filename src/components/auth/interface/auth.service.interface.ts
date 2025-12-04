import { RegisterRequestDto } from '../dto/request/register.request.dto';

export interface IAuthService {
  login(request: any): Promise<any>;
  verifyToken(request: any): Promise<any>;
  refreshToken(token: string): Promise<any>;
  register(payload: RegisterRequestDto): Promise<any>;
}

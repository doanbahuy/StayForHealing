import {
  CanActivate, // Interface của NestJS dùng để tạo Guard (quyết định request có được phép đi tiếp hay không)
  ExecutionContext, // Context chứa thông tin về request, handler, type (HTTP, RPC, WebSocket)
  Inject, // Decorator để inject service theo token
  Injectable, // Decorator đánh dấu class này có thể được inject (DI)
  UnauthorizedException, // Exception trả về lỗi 401 khi không được phép truy cập
} from '@nestjs/common';
import { Reflector } from '@nestjs/core'; // Dùng để đọc metadata từ decorators (@Public(), @Roles()...)
import { IS_PUBLIC_KEY } from '@core/decorator/set-public.decorator'; // custom decorator đánh dấu route public
import { ConfigService } from '@config/config.service'; // Service dùng để đọc config, ví dụ internalToken
import { IAuthService } from '@components/auth/interface/auth.service.interface'; // Interface của AuthService
import { IUserService } from '@components/user/interface/user.service.interface'; // Interface của UserService

@Injectable() // NestJS quản lý DI cho class này
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector, // Dùng để đọc metadata của route (ví dụ có decorator @Public() không)

    @Inject('IAuthService') // Inject service auth theo token 'IAuthService'
    private authService: IAuthService, // Service xử lý validate token, decode token

    @Inject('IUserService') // Inject service user theo token 'IUserService'
    private readonly userService: IUserService, // Service lấy thông tin chi tiết user

    private readonly configService: ConfigService, // Service đọc config (ví dụ internalToken)
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Kiểm tra route có được đánh dấu public không (bypass auth)
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), // handler function của route
      context.getClass(), // class controller
    ]);
    if (isPublic) {
      return true; // Nếu route public, cho phép request đi tiếp mà không cần auth
    }

    // 2. Lấy request object (chỉ áp dụng cho HTTP request)
    const req = await context.switchToHttp().getRequest();

    // 3. Lấy token từ header: có thể là 'authorization' hoặc 'custom'
    const requestToken = req?.headers?.authorization || req?.headers?.custom;

    // 4. Nếu là RPC (gọi nội bộ service), dùng internalToken từ config
    const token =
      context.getType() === 'rpc'
        ? this.configService.get('internalToken')
        : requestToken;

    // 5. Nếu không có token => throw 401
    if (!token) throw new UnauthorizedException();

    // 6. Nếu token là internal token => bypass authorize (dành cho service-to-service)
    if (token === this.configService.get('internalToken')) {
      return true;
    }

    // 7. Validate token bằng authService, trả về thông tin user từ token
    const userToken = await this.authService.validateToken(req);
    if (!userToken) {
      throw new UnauthorizedException(); // token không hợp lệ
    }

    // 8. Lấy chi tiết user từ DB theo email trong token
    const user = await this.userService.getUserDetail(userToken.email);
    if (!user) {
      throw new UnauthorizedException('User detail not found'); // user không tồn tại
    }

    // 9. Gán role cho user (lấy level của groupRole đầu tiên)
    user.role = user.roles?.[0]?.groupRole?.level;

    // 10. Gán thông tin user và header vào request để controller có thể sử dụng
    req.requestHeader = req?.headers;
    if (req.body) req.body.user = user;
    if (req.query) req.query.user = user;
    if (req.params) req.params.user = user;

    // 11. Authorization thành công => cho phép request đi tiếp
    return true;
  }
}

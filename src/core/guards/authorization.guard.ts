import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core/services';

import { ConfigService } from '@nestjs/config';
import { RoleEnum } from '@constant/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private logger = new Logger(AuthorizationGuard.name);
  constructor(
    private reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const req = await context.switchToHttp().getRequest();

    const requestToken = req?.headers?.authorization;
    const token =
      context.getType() === 'rpc'
        ? this.configService.get('INTERNAL_TOKEN')
        : requestToken;

    if (!token) throw new UnauthorizedException();
    req.requestHeader = req?.headers;
    req.requiredRoles = this.reflector.get<RoleEnum[]>(
      'roles',
      context.getHandler(),
    );
    this.assignUserToRequest(req, token);
    return true;
  }

  assignUserToRequest(req: any, token: string) {
    const userPayload = token.split('.')[1];
    try {
      const bearerToken = token.replace('Bearer ', '');
      const payload = this.jwtService.verify(bearerToken, {
        secret: this.configService.get('JWT_SECRET'),
      });
      req.user = payload.user;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    const user = JSON.parse(Buffer.from(userPayload, 'base64').toString());
    if (req.requiredRoles && !req.requiredRoles.includes(user.user.role)) {
      throw new UnauthorizedException('Role not allowed');
    }

    req.user = user;
    if (req.body) req.body.user = user;
    if (req.query) req.query.user = user;
    if (req.params) req.params.user = user;
  }
}

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
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
    this.assignCustomerToRequest(req, token);
    return true;
  }

  assignCustomerToRequest(req: any, token: string) {
    const customerPayload = token.split('.')[1];
    try {
      const bearerToken = token.replace('Bearer ', '');
      const payload = this.jwtService.verify(bearerToken, {
        secret: this.configService.get('JWT_SECRET'),
      });
      req.user = payload.user;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    const customer = JSON.parse(
      Buffer.from(customerPayload, 'base64').toString(),
    );
    if (req.requiredRoles && !req.requiredRoles.includes(customer.user.role)) {
      throw new UnauthorizedException('Role not allowed');
    }

    req.user = customer;
    if (req.body) req.body.customer = customer;
    if (req.query) req.query.customer = customer;
    if (req.params) req.params.customer = customer;
  }
}

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private logger = new Logger(AuthorizationGuard.name);
  constructor(
    private reflector: Reflector,
    private readonly configService: ConfigService,
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
    this.assignCustomerToRequest(req, token);

    return true;
  }

  assignCustomerToRequest(req: any, token: string) {
    const customerPayload = token.split('.')[1];
    const customer = JSON.parse(Buffer.from(customerPayload, 'base64').toString());
    if (req.body) req.body.customer = customer;
    if (req.query) req.query.customer = customer;
    if (req.params) req.params.customer = customer;
  }
}

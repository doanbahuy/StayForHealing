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
    this.assignUserToRequest(req, token);

    return true;
  }

  assignUserToRequest(req: any, token: string) {
    const userPayload = token.split('.')[1];
    const user = JSON.parse(Buffer.from(userPayload, 'base64').toString());
    if (req.body) req.body.user = user;
    if (req.query) req.query.user = user;
    if (req.params) req.params.user = user;
  }
}

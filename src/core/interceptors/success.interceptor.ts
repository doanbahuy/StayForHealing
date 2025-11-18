import { ResponseCodeEnum } from '@constant/response-code.enum';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ResponseBuilder } from '@utils/response-builder';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SuccessInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        map((data) =>
          new ResponseBuilder()
            .withData(data)
            .withCode(ResponseCodeEnum.SUCCESS)
            .withMessage('Thành công')
            .build(),
        ),
      );
  }
}

import { ResponseCodeEnum } from '@constant/response-code.enum'; // Enum chứa các mã response (ví dụ BAD_REQUEST, SUCCESS…)
import {
  Injectable,
  NestInterceptor, // Interface interceptor của NestJS
  ExecutionContext, // Context chứa request, handler, type (HTTP, RPC,…)
  CallHandler, // Handler trả về Observable của route
} from '@nestjs/common';
import { ResponseBuilder } from '@utils/response-builder'; // Utility để build response chuẩn
import { throwError } from 'rxjs'; // RxJS throwError để tạo Observable lỗi
import { catchError } from 'rxjs/operators'; // RxJS operator để catch lỗi trong Observable

@Injectable() // NestJS sẽ quản lý DI cho class này
export class ErrorsInterceptor implements NestInterceptor {
  // intercept được gọi khi request đi qua interceptor này
  intercept(context: ExecutionContext, next: CallHandler): any {
    return next
      .handle() // gọi handler gốc, trả về Observable
      .pipe(
        // bắt lỗi trong Observable
        catchError((err) =>
          throwError(() => {
            // tạo Observable lỗi mới
            console.log(err.stack); // log stack trace lỗi ra console
            // build response lỗi chuẩn
            return new ResponseBuilder()
              .withCode(ResponseCodeEnum.BAD_REQUEST) // gán code lỗi
              .withData(null) // data trả về là null
              .withMessage(err.message || 'Thất bại'); // message từ lỗi, hoặc default
            // .build();                                // trả về object hoàn chỉnh
          }),
        ),
      );
  }
}

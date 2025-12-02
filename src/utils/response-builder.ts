import { ResponseCodeEnum, getMessage } from '@constant/response-code.enum';
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Inject,
  NotFoundException,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponsePayload } from './response-payload';

export class ResponseBuilder<T> {
  private payload: ResponsePayload<T> = {
    statusCode: ResponseCodeEnum.SUCCESS,
  };

  @Inject(Res)
  private readonly response: Response;

  constructor(data?: T) {
    this.payload.data = data;
  }

  withCode(code: ResponseCodeEnum): ResponseBuilder<T> {
    this.payload.statusCode = code;
    return this;
  }

  withMessage(message: string): ResponseBuilder<T> {
    this.payload.message = message;
    return this;
  }

  withData(data: T): ResponseBuilder<T> {
    this.payload.data = data;
    return this;
  }

  build(): ResponsePayload<T> {
    if (!this.payload.message) {
      this.payload.message = getMessage(this.payload.statusCode);
    }
    // if (this.payload.statusCode !== ResponseCodeEnum.SUCCESS) {
    //   this.__throwException();
    // }
    return this.payload;
  }

  private __throwException(): HttpException {
    switch (this.payload.statusCode) {
      case ResponseCodeEnum.BAD_REQUEST:
        throw new BadRequestException(this.payload.message);
      case ResponseCodeEnum.FORBIDDEN:
        throw new ForbiddenException(this.payload.message);
      case ResponseCodeEnum.NOT_FOUND:
        throw new NotFoundException(this.payload.message);
      case ResponseCodeEnum.UNAUTHORIZED:
        throw new UnauthorizedException(this.payload.message);
      case ResponseCodeEnum.INTERNAL_SERVER_ERROR:
        throw new HttpException(this.payload.message, this.payload.statusCode);
      default:
        throw new HttpException(
          'INTERNAL_SERVER_ERROR',
          ResponseCodeEnum.INTERNAL_SERVER_ERROR,
        );
    }
  }
}

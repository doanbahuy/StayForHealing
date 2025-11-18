import { BaseRequestDto } from '@core/dto/base-request.dto';

export class BaseParamDto extends BaseRequestDto {
  sort: string;

  lang: string;

  order: string;

  per_page: number;

  after_token: string;

  before_token: string;

  page: number;
}

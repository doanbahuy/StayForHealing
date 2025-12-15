import { SetMetadata } from '@nestjs/common';

export const RATE_LIMIT_OPTIONS = 'rate_limit_options';

export const RateLimit = (options: { window: number; max: number }) =>
  SetMetadata(RATE_LIMIT_OPTIONS, options);

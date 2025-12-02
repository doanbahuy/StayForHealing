import { plainToInstance } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsString()
  NODE_ENV: string;

  @IsString()
  SERVER_HTTP_PORT: string;

  @IsString()
  INTERNAL_TOKEN: string;

  @IsString()
  REDIS_HOST: string;

  @IsString()
  REDIS_PORT: string;

  @IsString()
  REDIS_URI: string;

  @IsString()
  API_AUTH: string;

  @IsString()
  CORS_ORIGIN: string;

  @IsString()
  CORS_ALLOWED_HEADERS: string;
}

export function envConfig(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}

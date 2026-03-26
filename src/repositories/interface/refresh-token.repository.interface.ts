import { RefreshTokenEntity } from '@databases/postgres/entities/refresh-token.entity';

export interface IRefreshTokenRepository {
  createEntity(data: any): RefreshTokenEntity;
  createEntities(data: any[]): RefreshTokenEntity[];
  // Add custom query method signatures here
}

import { BaseEntity } from '@core/entity/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AccountEntity } from './account.entity';

@Entity('refresh_token')
export class RefreshTokenEntity extends BaseEntity {
  @OneToOne(() => AccountEntity)
  @JoinColumn()
  account: AccountEntity;

  @Column()
  tokenHash: string;

  @Column()
  expiresAt: Date;

  @Column()
  revoked: boolean;
}

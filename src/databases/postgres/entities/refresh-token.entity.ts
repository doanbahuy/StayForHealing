import { BaseEntity } from '@core/entity/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AccountEntity } from './account.entity';

@Entity()
export class RefreshTokenEntity extends BaseEntity {
  @Column({ unique: true })
  token: string;

  @OneToOne(() => AccountEntity)
  @JoinColumn()
  user: AccountEntity;
}

import { BaseEntity } from '@core/entity/base.entity';
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { AccountEntity } from './account.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, comment: 'Tên đầy đủ' })
  fullName: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'Số điện thoại',
    nullable: true,
  })
  phone: string;

  @OneToOne(() => AccountEntity)
  @JoinColumn()
  account: AccountEntity;
}

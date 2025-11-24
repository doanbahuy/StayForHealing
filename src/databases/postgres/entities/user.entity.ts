import { BaseEntity } from '@core/entity/base.entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, comment: 'Mã người dùng' })
  customerCode: string;

  @Column({ type: 'varchar', length: 255, comment: 'Tên hiển thị' })
  username: string;

  @Column({
    type: 'smallint',
    default: 0,
    comment: 'trạng thái user: 1-active, 0-inactive',
  })
  status: number;
}

import { BaseEntity } from '@core/entity/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('customer')
export class CustomerEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, comment: 'Mã người dùng' })
  customerCode: string;

  @Column({ type: 'varchar', length: 255, comment: 'Tên hiển thị' })
  customerName: string;

  @Column({
    type: 'smallint',
    default: 1,
    comment: 'trạng thái customer: 1-active, 0-inactive',
  })
  status: number;
}

import { BaseEntity } from '@core/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomerEntity } from './customer.entity';

@Entity()
export class HomestayEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, comment: 'Mô tả tiện ích phòng' })
  description: string;

  @Column({ type: 'varchar', length: 255, comment: 'Địa chỉ' })
  address: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'Tên homestay',
  })
  title: string;

  @Column({
    type: 'smallint',
    default: 1,
    comment: 'Trạng thái homestay: 1-active, 0-inactive',
  })
  status: number;

  @ManyToOne(() => CustomerEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  owner: CustomerEntity;
}

import { BaseEntity } from '@core/entity/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
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
    unique: true,
  })
  title: string;

  @OneToOne(() => CustomerEntity)
  @JoinColumn()
  owner: CustomerEntity;
}

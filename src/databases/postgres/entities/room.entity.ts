import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '@core/entity/base.entity';
import { HomestayEntity } from './homestay.entity';
@Entity()
export class RoomEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100, comment: 'Mã phòng' })
  roomCode: string;

  @Column({ type: 'smallint', comment: 'Số lượng' })
  capacity: number;

  @Column({ type: 'int', comment: 'Giá phòng cơ bản' })
  base_price: number;

  @OneToOne(() => HomestayEntity)
  @JoinColumn()
  home: HomestayEntity;

  @Column({
    type: 'smallint',
    default: 1,
    comment: 'Trạng thái phòng: 1-active, 0-inactive',
  })
  status: number;
}

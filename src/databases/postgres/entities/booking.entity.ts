import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { AccountEntity } from './account.entity';
import { RoomEntity } from './room.entity';
import { BookingEnum } from '@constant/common';
import { BaseEntity } from '@core/entity/base.entity';

@Entity('booking')
export class BookingEntity extends BaseEntity {
  @ManyToOne(() => AccountEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'account_id' })
  account: AccountEntity;

  @ManyToOne(() => RoomEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'room_id' })
  room: RoomEntity;

  @Column({ type: 'date', name: 'check_in_date' })
  checkInDate: string;

  @Column({ type: 'date', name: 'check_out_date' })
  checkOutDate: string;

  @Column({ type: 'int' })
  guests: number;

  @Column({
    type: 'enum',
    enum: BookingEnum,
    default: BookingEnum.PENDING,
  })
  status: BookingEnum;
}

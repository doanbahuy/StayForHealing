import {
  Column,
  Entity,
  IsNull,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { BookingEntity } from './booking.entity';
import { BaseEntity } from '@core/entity/base.entity';

@Entity('account')
export class AccountEntity extends BaseEntity {
  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  role: string;
}

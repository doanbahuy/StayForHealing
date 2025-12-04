import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomerEntity } from './customer.entity';

@Entity()
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @OneToOne(() => CustomerEntity)
  @JoinColumn()
  customer: CustomerEntity;
}

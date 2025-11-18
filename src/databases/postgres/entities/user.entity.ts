import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    name: 'customer_code',
  })
  code: string;

  @Column({
    name: 'customer_name',
  })
  name: string;
}

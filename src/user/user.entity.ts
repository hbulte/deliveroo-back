import { Exclude } from 'class-transformer';
import { CartItem } from 'src/cart/cart.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  salt: string;

  @Column()
  hash: string;

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string;

  @OneToMany(() => CartItem, (cartItem) => cartItem.user)
  @JoinColumn()
  cart: CartItem[];

  @Column({ type: 'float', default: 0 })
  cartTotal: number;
}

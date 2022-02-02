import { CartItem } from 'src/cart/cart.entity';
import { Store } from 'src/store/entities/store.entity';

import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productName: string;

  @Column()
  productDesc: string;

  @Column()
  productImageUrl: string;

  @Column({ type: 'float' })
  productPrice: number;

  @Column()
  productNumber: number;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];

  @ManyToOne(() => Store, (store) => store.products)
  store: Store;
}

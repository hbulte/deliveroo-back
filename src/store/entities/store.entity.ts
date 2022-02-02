import { Product } from 'src/product/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  storeName: string;

  @Column()
  storeDesc: string;

  @OneToMany((type) => Product, (product) => product.store)
  @JoinTable()
  products: Product[];
}

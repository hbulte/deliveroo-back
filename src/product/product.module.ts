import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { Category } from './entities/category.entity';
import { StoreModule } from '../store/store.module';
import { Store } from 'src/store/entities/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, Store]), StoreModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}

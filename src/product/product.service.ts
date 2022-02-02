import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from 'src/store/entities/store.entity';
import { StoreService } from 'src/store/store.service';
import {
  createQueryBuilder,
  getConnection,
  getRepository,
  Repository,
} from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { InsertData } from './interface/insert-data.interface';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    private readonly storeService: StoreService,
  ) {}

  async getProduct(storeId) {
    try {
      await getRepository(Product)
        .createQueryBuilder('product')
        .where('product.storeId = :id', { id: storeId.id })
        .getMany();
    } catch (error) {
      return error.message;
    }
  }

  async getStoreData(storeId) {
    return await getRepository(Category)
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.products', 'product')
      .where('category.id = product.categoryId')
      .andWhere('product.storeId=:id', { id: storeId.id })
      .getMany();
  }

  async createProduct(data: CreateProductDto) {
    try {
      const { category, storeId, ...rest } = data;

      const isStoreExist = await this.storeService.getOneStore(storeId);
      if (!isStoreExist) {
        throw new NotFoundException("The store doesn't exist");
      }
      const isCategoryExist = await this.categoryRepository.findOne({
        categoryName: category,
      });

      //  Insertion dans une categorie existante //

      if (isCategoryExist) {
        const insertData: InsertData = rest;
        insertData.category = isCategoryExist.id;

        return await getConnection()
          .createQueryBuilder()
          .insert()
          .into(Product)
          .values(insertData)
          .execute();
      }

      //  Insertion dans une nouvelle categorie  //

      const resp = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Category)
        .values({ categoryName: category })
        .execute();

      const insertData: InsertData = {
        ...rest,
        store: isStoreExist.id,
        category: resp.identifiers[0].id,
      };

      return await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Product)
        .values(insertData)
        .execute();
    } catch (error) {
      error.message;
    }
  }
}

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //   @Get(':id')
  //   async getProduct(@Param() storeId: string) {
  //     return await this.productService.getProduct(storeId);
  //   }

  @Get(':id')
  async getStoreData(@Param() storeId: string) {
    return await this.productService.getStoreData(storeId);
  }

  @Post()
  async createProduct(@Body() data: CreateProductDto) {
    return await this.productService.createProduct(data);
  }
}

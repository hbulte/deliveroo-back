import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoreService } from './store.service';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  async createStore(@Body() data: CreateStoreDto) {
    return await this.storeService.createStore(data);
  }

  @Get()
  async getStore() {
    return await this.storeService.getStore();
  }
}

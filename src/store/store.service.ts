import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStoreDto } from './dto/create-store.dto';
import { Store } from './entities/store.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async getStore() {
    return await this.storeRepository.find();
  }

  async getOneStore(id: string) {
    return await this.storeRepository.findOne(id);
  }

  async createStore(data: CreateStoreDto) {
    return await this.storeRepository.save(data);
  }
}

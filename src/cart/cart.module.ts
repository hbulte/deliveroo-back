import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartItem } from './cart.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem, User])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}

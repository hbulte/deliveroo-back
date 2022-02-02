import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository, createQueryBuilder, getRepository } from 'typeorm';
import { CartItem } from './cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async addToCart(req, body) {
    try {
      const isItemAlready = await this.cartItemRepository.findOne({
        where: {
          user: req.user.id,
          product: body.productToAdd,
        },
      });
      if (isItemAlready) {
        await this.cartItemRepository.update(isItemAlready.id, {
          quantity: isItemAlready.quantity + 1,
        });
      } else {
        await this.cartItemRepository.save({
          quantity: 1,
          user: req.user.id,
          product: body.productToAdd,
        });
      }
      await this.updateCartTotal(req);
      return this.getUserCart(req);
    } catch (error) {
      return error.message;
    }
  }

  async removeFromCart(req, body) {
    try {
      const isItemAlready = await this.cartItemRepository.findOne({
        where: {
          user: req.user.id,
          product: body.productToRemove,
        },
      });
      if (isItemAlready.quantity === 1) {
        await this.cartItemRepository.delete(isItemAlready);
      } else if (isItemAlready) {
        await this.cartItemRepository.update(isItemAlready.id, {
          quantity: isItemAlready.quantity - 1,
        });
      }
      await this.updateCartTotal(req);
      return this.getUserCart(req);
    } catch (error) {
      return error.message;
    }
  }

  async getUserCartWithoutTotal(req) {
    const cartArray = await getRepository(CartItem)
      .createQueryBuilder('cartItem')
      .leftJoinAndSelect('cartItem.product', 'product')
      .where('cartItem.user=:id', { id: req.user.id })
      .getMany();
    return cartArray;
  }

  async getUserCart(req) {
    const cartArray = await getRepository(CartItem)
      .createQueryBuilder('cartItem')
      .leftJoinAndSelect('cartItem.product', 'product')
      .where('cartItem.user=:id', { id: req.user.id })
      .getMany();

    const cartTotal = await this.userRepository.findOne(req.user.id);
    return { cartArray: cartArray, cartTotal: cartTotal.cartTotal };
  }

  async updateCartTotal(req) {
    let cartTotal: number = 0;
    const productItem = await this.getUserCartWithoutTotal(req);

    for (let i in productItem) {
      cartTotal =
        cartTotal +
        productItem[i].quantity * productItem[i].product.productPrice;
    }
    await this.userRepository.update(req.user.id, { cartTotal: cartTotal });
  }
}

import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserCart(@Request() req) {
    return this.cartService.getUserCart(req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addToCart(@Request() req, @Body() body) {
    return this.cartService.addToCart(req, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('remove')
  async removeFromCart(@Request() req, @Body() body) {
    return this.cartService.removeFromCart(req, body);
  }
}

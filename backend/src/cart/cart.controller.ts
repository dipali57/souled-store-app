import { Controller, Post, Get, Delete, Body, Request, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  async getCart(@Request() req) {
    return this.cartService.getUserCart(req.user.id);
  }

  @Post('add')
  async addToCart(@Request() req, @Body() body) {
    return this.cartService.addToCart(req.user.id, body.productId, body.quantity);
  }

  @Delete('remove')
  async removeFromCart(@Request() req, @Body() body) {
    return this.cartService.removeFromCart(req.user.id, body.productId);
  }
}

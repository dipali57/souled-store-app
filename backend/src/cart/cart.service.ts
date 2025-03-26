import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';


@Injectable()
export class CartService {
  constructor(@InjectRepository(Cart) private cartRepo: Repository<Cart>) {}

  async getUserCart(userId: number) {
    // return this.cartRepo.find({ where: { user: userId } });
    return this.cartRepo.find({ where: { user: {id: userId} } });
  }

  async addToCart(userId: number, productId: number, quantity: number) {
    const cartItem = this.cartRepo.create({ user: {id: userId}, product: {id: productId}, quantity });
    return this.cartRepo.save(cartItem);
  }

  async removeFromCart(userId: number, productId: number) {
    return this.cartRepo.delete({ user: {id: userId}, product: {id: productId} });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Wishlist } from './entities/wishlist.entity';
import { Product } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepo: Repository<Wishlist>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async add(productId: number, user: User) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });

    if (!product) throw new NotFoundException('Product not found');

    const exists = await this.wishlistRepo.findOne({
      where: { user: { id: user.id }, product: { id: productId } },
    });

    if (exists) return exists;

    const item = this.wishlistRepo.create({
      user,
      product,
    });

    return this.wishlistRepo.save(item);
  }

  async getMyWishlist(userId: number) {
    return this.wishlistRepo.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });
  }

  async remove(productId: number, userId: number) {
    const item = await this.wishlistRepo.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (!item) throw new NotFoundException('Item not found');

    await this.wishlistRepo.remove(item);

    return { message: 'Removed from wishlist' };
  }
}

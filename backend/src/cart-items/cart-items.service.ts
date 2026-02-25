import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Index, Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Product } from 'src/products/entities/product.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { RemoveCartItemDto } from './dto/remove-cart-item.dto';

@Injectable()
export class CartItemsService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemsRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Cart) private readonly cartsRepository: Repository<Cart>,
  ) {}

  async addCartItem(dto: CreateCartItemDto) {
    const { cartId, productId } = dto;

    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    if (product.stock <= 0) {
      throw new BadRequestException('Product out of stock');
    }
    let existingCartItem = await this.cartItemsRepository.findOne({
      where: {
        product: { id: productId },
        cart: { id: cartId },
      },
    });

    if (existingCartItem) {
      if (existingCartItem.quantity + 1 > product.stock) {
        throw new BadRequestException('Stock limit reached');
      }
      existingCartItem.quantity += 1;
    } else {
      existingCartItem = this.cartItemsRepository.create({
        cart: { id: cartId },
        product: { id: productId },
        quantity: 1,
      });
    }

    return this.cartItemsRepository.save(existingCartItem);
  }

  async removeCartItem(removeCartItemDto: RemoveCartItemDto) {
    const { cartId, productId } = removeCartItemDto;
    const cartItem = await this.cartItemsRepository.findOne({
      where: { cart: { id: cartId }, product: { id: productId } },
    });
    if (!cartItem) {
      throw new BadRequestException('Cart item not found');
    }
    await this.cartItemsRepository.remove(cartItem);

    const remainingItems = await this.cartItemsRepository.find({
      where: { cart: { id: cartId } },
    });

    if (remainingItems.length === 0) {
      await this.cartsRepository.delete(cartId);
      return { message: 'Cart item removed and cart deleted as it is empty' };
    }

    return { message: 'Cart item removed successfully' };
  }

  async updateCartItemQuantity(updateCartItemDto: UpdateCartItemDto) {
    const { cartId, productId, quantity } = updateCartItemDto;
    const cartItem = await this.cartItemsRepository.findOne({
      where: { cart: { id: cartId }, product: { id: productId } },
      relations: ['product', 'cart'],
    });

    if (!cartItem) {
      throw new NotFoundException('Product not found in cart');
    }

    if (quantity <= 0) {
      await this.cartItemsRepository.remove(cartItem);
      return;
    }

    if (quantity > cartItem.product.stock) {
      throw new BadRequestException('Quantity exceeds stock');
    }

    cartItem.quantity = quantity;
    return await this.cartItemsRepository.save(cartItem);
  }

  async clearCartItems(cartId: number) {
    await this.cartItemsRepository.delete({ cart: { id: cartId } });
    return { message: 'All cart items removed successfully' };
  }
}

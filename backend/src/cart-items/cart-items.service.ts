import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    @InjectRepository(Product) private readonly productsRepository: Repository<Product>,
    @InjectRepository(Cart) private readonly cartsRepository: Repository<Cart>,
  ) {}

  async addCartItem(dto: CreateCartItemDto) {
    const {cartId, productId} = dto;

    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }
    const existingCartItem = await this.cartItemsRepository.findOne({
      where: {
        product: { id: productId },
        cart: { id: cartId },
      },
    });

    if (existingCartItem) {
      throw new BadRequestException('Product already in cart');
    } else {
      const cart = await this.cartsRepository.findOne({
        where: { id: cartId },
      });
      if (!cart) {
        throw new BadRequestException('Cart not found');
      }

      const cartItem = this.cartItemsRepository.create({
        cart: cart,
        product: product,
      });
      return this.cartItemsRepository.save(cartItem);
    }
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
    });
    if (!cartItem) {
      throw new NotFoundException('Product not found in cart');
    }
    cartItem.quantity = quantity;
    await this.cartItemsRepository.save(cartItem);

    return cartItem;
  }

  async clearCartItems(cartId: number) {
    await this.cartItemsRepository.delete({ cart: { id: cartId } });
    return { message: 'All cart items removed successfully' };
  }
}

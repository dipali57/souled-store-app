import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { CartItemsService } from 'src/cart-items/cart-items.service';
import { RemoveFromCartDTO } from './dto/remove-from-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartResponseDto } from './dto/cart-response.dto';
import { CartItemResponseDto } from 'src/cart-items/dto/cart-item-response.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    private readonly cartItemsService: CartItemsService,
  ) {}

  private async getUserCartEntity(userId: number): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['cartItems', 'cartItems.product', 'user'],
    });

    if (!cart) {
      cart = this.cartRepository.create({
        user: { id: userId } as User,
        cartItems: [],
      });
      await this.cartRepository.save(cart);
    }
    return cart;
  }

  async addToCart(
    addToCartDto: CreateCartDto,
    user: User,
  ): Promise<CartResponseDto> {
    let cart = await this.getUserCartEntity(user.id);

    await this.cartItemsService.addCartItem({
      productId: addToCartDto.productId,
      cartId: cart.id,
    });

    const updated = await this.getUserCartEntity(user.id);
    return this.formatCart(updated);
  }

  async updateCart(
    updateCartDto: UpdateCartDto,
    user: User,
  ): Promise<CartResponseDto> {
    const { productId, quantity } = updateCartDto;

    const cart = await this.getUserCartEntity(user.id);

    await this.cartItemsService.updateCartItemQuantity({
      cartId: cart.id,
      productId,
      quantity,
    });

    const updated = await this.getUserCartEntity(user.id);
    return this.formatCart(updated);
  }

  async removeFromCart(
    removeCartDto: RemoveFromCartDTO,
    user: User,
  ): Promise<CartResponseDto> {
    const { productId } = removeCartDto;
    const cart = await this.getUserCartEntity(user.id);
    if (!cart) {
      throw new NotFoundException('Cart not found for this user.');
    }
    await this.cartItemsService.removeCartItem({
      cartId: cart.id,
      productId,
    });

    const updated = await this.getUserCartEntity(user.id);
    return this.formatCart(updated);
  }

  async getUserCart(user: User): Promise<CartResponseDto> {
    const cart = await this.getUserCartEntity(user.id);
    if (!cart) {
      throw new NotFoundException('Cart not found for this user.');
    }
    return this.formatCart(cart);
  }

  async clearCart(userId: number): Promise<void> {
    const cart = await this.getUserCartEntity(userId);

    if (!cart) {
      throw new NotFoundException('Cart not found for this user.');
    }

    await this.cartItemsService.clearCartItems(cart.id);

    await this.cartRepository.delete(cart.id);
  }

  private formatCart(cart: any): CartResponseDto {
    const cartItems: CartItemResponseDto[] = cart.cartItems.map(
      (item: any) => ({
        id: item.id,
        cartId: item.cartId,
        productId: item.productId,
        quantity: item.quantity,
        product: {
          ...item.product,
          price: Number(item.product.price),
        },
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }),
    );

    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      id: cart.id,
      userId: cart.userId,
      cartItems,
      totalPrice,
      totalItems,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
  }
}

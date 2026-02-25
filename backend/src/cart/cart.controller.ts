import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Request,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateCartItemDto } from 'src/cart-items/dto/create-cart-item.dto';
import { RemoveFromCartDTO } from './dto/remove-from-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CreateCartDto } from './dto/create-cart.dto';
import { Role } from 'src/common/enums/user-role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { CartResponseDto } from './dto/cart-response.dto';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  async getUserCart(@CurrentUser() user: User): Promise<CartResponseDto> {
    return await this.cartService.getUserCart(user);
  }

  @Post('add')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  async addToCart(
    @Body() createCartDto: CreateCartDto,
    @CurrentUser() user: User,
  ): Promise<CartResponseDto> {
    return this.cartService.addToCart(createCartDto, user);
  }

  @Delete('remove')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  async removeFromCart(
    @Body() removeCartDto: RemoveFromCartDTO,
    @CurrentUser() user: User,
  ): Promise<CartResponseDto> {
    return this.cartService.removeFromCart(removeCartDto, user);
  }

  //  Clear all items from cart
  @Delete()
  async clearCart(@CurrentUser() user: User): Promise<void> {
    return this.cartService.clearCart(user.id);
  }

  @Patch('update')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  async updateItemQuantityFromCart(
    @Body() updateCartDto: UpdateCartDto,
    @CurrentUser() user: User,
  ): Promise<CartResponseDto> {
    return this.cartService.updateCart(updateCartDto, user);
  }
}

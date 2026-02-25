import { CartItemResponseDto } from 'src/cart-items/dto/cart-item-response.dto';

export class CartResponseDto {
  id: string;

  userId: string;

  cartItems: CartItemResponseDto[];

  totalPrice: number;

  totalItems: number;

  createdAt: Date;

  updatedAt: Date;
}

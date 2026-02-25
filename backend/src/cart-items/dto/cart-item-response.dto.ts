import { ProductResponseDto } from "src/products/dto/product-response.dto";

export class CartItemResponseDto {
  id: string;

  cartId: string;

  productId: number;

  quantity: number;

  product: ProductResponseDto;

  createdAt: Date;

  updatedAt: Date;
}

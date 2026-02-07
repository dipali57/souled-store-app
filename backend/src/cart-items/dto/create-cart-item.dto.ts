import { IsNotEmpty, IsNumber } from "@nestjs/class-validator";

export class CreateCartItemDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  cartId: number;
}

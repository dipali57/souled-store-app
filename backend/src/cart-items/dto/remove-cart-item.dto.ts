import { IsNotEmpty, IsNumber } from "@nestjs/class-validator";


export class RemoveCartItemDto {
  @IsNotEmpty()
  @IsNumber()
  cartId: number;

  @IsNotEmpty()
  @IsNumber()
  productId: number;
}

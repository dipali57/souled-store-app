import { IsNotEmpty, IsNumber } from "@nestjs/class-validator";

export class CreateCartDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;
}

import { IsNotEmpty, IsNumber } from "@nestjs/class-validator";

export class UpdateProductStockDto {
  @IsNumber()
  @IsNotEmpty()
  stock: number;
}

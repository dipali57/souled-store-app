import { IsNotEmpty, IsNumber } from "@nestjs/class-validator";
import { CreateCartDto } from "./create-cart.dto";

export class UpdateCartDto extends CreateCartDto {
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

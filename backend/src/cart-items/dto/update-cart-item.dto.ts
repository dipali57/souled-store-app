import { IsNotEmpty, IsNumber } from '@nestjs/class-validator';
import { CreateCartItemDto } from './create-cart-item.dto';

export class UpdateCartItemDto extends CreateCartItemDto {
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

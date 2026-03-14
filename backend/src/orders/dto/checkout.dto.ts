import { IsArray, IsNumber } from 'class-validator';

export class CheckoutDto {
  @IsArray()
  @IsNumber({}, { each: true })
  cartItemIds: number[];
}

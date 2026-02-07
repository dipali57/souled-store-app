import { IsNotEmpty, IsNumber, IsString } from '@nestjs/class-validator';
import { IsOptional } from '@nestjs/class-validator';

export class CreateProductDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  stock: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
}

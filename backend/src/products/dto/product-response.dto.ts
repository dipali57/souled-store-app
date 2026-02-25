import { Category } from "src/category/entities/category.entity";

export class ProductResponseDto {
  id: number;

  name: string;

  description: string | null;

  price: number;

  stock: number;

  sku: string;

  imageUrl: string | null;

  category: Category;

  isActive: boolean;

}

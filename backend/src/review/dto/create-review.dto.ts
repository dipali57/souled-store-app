import { IsNotEmpty, IsNumber, Min, Max, IsString } from "@nestjs/class-validator";

export class CreateReviewDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsNotEmpty()
  @IsNumber()
  productId: number;
}

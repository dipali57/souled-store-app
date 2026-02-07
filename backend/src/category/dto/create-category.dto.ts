import { IsNotEmpty, IsString } from "@nestjs/class-validator";


export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}

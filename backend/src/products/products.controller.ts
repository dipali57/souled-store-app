import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  Param,
  Put,
  Query,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/user-role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { UpdateProductDTO } from './dto/update-product.dto';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductStockDto } from './dto/update-product-stock.dto';
import { Express } from 'express';
import { ProductImageInterceptor } from './interceptors/product-img.interceptor';
import { ProductResponseDto } from './dto/product-response.dto';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  // Add a new product (Admin-only)
  @Roles(Role.ADMIN)
  @Post('add')
  @UseInterceptors(ProductImageInterceptor())
  async addProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDTO,
  ){
    return this.productsService.addProduct(createProductDto, file);
  }

  // Fetch all products with optional filters
  @Get('filter')
  getAllProducts(
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('search') search?: string,
  ) {
    return this.productsService.getAllProducts(
      category,
      minPrice,
      maxPrice,
      search,
    );
  }

  @Get()
  async getProducts(
    @Query('sort') sort?: string,
    @Query('categoryId') categoryId?: number,
    @Query('productName') productName?: string,
  ) {
    return this.productsService.findAll(sort, categoryId, productName);
  }

  // Fetch a single product by ID
  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: number) {
    return this.productsService.findOne(id);
  }

  // Update a product (Admin-only)
  @Put(':id')
  @Roles(Role.ADMIN)
  @UseInterceptors(ProductImageInterceptor())
  async updateProduct(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateProductDto: UpdateProductDTO,
  ) {
    return this.productsService.updateProduct(
      Number(id),
      updateProductDto,
      file,
    );
  }

  @Roles(Role.ADMIN)
  @Patch(':id/stock')
  updateStock(
    @Param('id') id: number,
    @Body() updateProductStockDto: UpdateProductStockDto,
  ) {
    return this.productsService.updateStock(id, updateProductStockDto);
  }

  // Delete a product (Admin-only)
  @Roles(Role.ADMIN)
  @Delete(':id')
  deleteProduct(@Param('id') id: number) {
    return this.productsService.deleteProduct(id);
  }
}

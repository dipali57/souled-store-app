import { Controller, Get, Post, Body, Delete, UseGuards, Param, Put, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { UpdateProductDTO } from './dto/update-product.dto';
import { CreateProductDTO } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  // Fetch all products with optional filters
  @Get()
  getAllProducts(
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('search') search?: string,
  ) {
    return this.productsService.getAllProducts(category, minPrice, maxPrice, search);
  }
  // @Post()
  // async createProduct(@Body() body) {
  //   return this.productsService.addProduct(body);
  // }

   // Fetch a single product by ID
   @Get(':id')
   getProductById(@Param('id') id: number) {
     return this.productsService.getProductById(id);
   }
 
   // Add a new product (Admin-only)
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles(UserRole.ADMIN)
   @Post('add')
   addProduct(@Body() createProductDto: CreateProductDTO) {
    console.log('createProductDto', createProductDto);
     return this.productsService.addProduct(createProductDto);
   }
 
   // Update a product (Admin-only)
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles(UserRole.ADMIN)
   @Put(':id')
   updateProduct(@Param('id') id: number, @Body() updateProductDto: UpdateProductDTO) {
     return this.productsService.updateProduct(id, updateProductDto);
   }
 
   // Delete a product (Admin-only)
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles(UserRole.ADMIN)
   @Delete(':id')
   deleteProduct(@Param('id') id: number) {
     return this.productsService.deleteProduct(id);
   }

}

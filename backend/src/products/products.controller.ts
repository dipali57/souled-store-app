import { Controller, Get, Post, Body, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async getAllProducts() {
    return { message: 'List of all products' };
  }

  @Post()
  async createProduct(@Body() body) {
    return this.productsService.create(body);
  }

  @Post('add')
  @Roles(UserRole.ADMIN)
  async addProduct(@Body() body) {
    return { message: 'Product added successfully' };
  }

  @Delete('remove')
  @Roles(UserRole.ADMIN)
  async removeProduct(@Body('id') productId: number) {
    return { message: 'Product removed successfully' };
  }
}

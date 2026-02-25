import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { Category } from 'src/category/entities/category.entity';
import { UpdateProductStockDto } from './dto/update-product-stock.dto';
import { writeFile } from 'fs';
import { join } from 'path';
import { memoryStorage, Multer } from 'multer';
import { Express } from 'express';
import { ProductResponseDto } from './dto/product-response.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll(
    sort?: string,
    categoryId?: number,
    productName?: string,
  ): Promise<ProductResponseDto[]> {
    const queryBuilder = this.productsRepository.createQueryBuilder('product');

    // Join category for filtering
    queryBuilder
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.reviews', 'reviews');

    // Filter by category if categoryId is provided
    if (categoryId) {
      queryBuilder.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    // Filter by product name if productName is provided
    if (productName) {
      queryBuilder.andWhere('product.name LIKE :name', {
        name: `%${productName}%`,
      });
    }

    // Sort if sort parameter is provided
    if (sort) {
      const sortOrder = sort.startsWith('-') ? 'DESC' : 'ASC';
      const sortField = sort.replace('-', ''); // Remove the '-' for field name
      queryBuilder.orderBy(`product.${sortField}`, sortOrder);
    }
    return await queryBuilder.getMany();
  }

  async addProduct(
    createProductDto: CreateProductDTO,
    file: Express.Multer.File,
  ) {
    const category = await this.categoryRepository.findOne({
      where: { id: createProductDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const product = this.productsRepository.create({
      ...createProductDto,
      category,
      imageUrl: `/uploads/products/${file.filename}`,
    });

    return this.productsRepository.save(product);
  }

  // Fetch all Products and Filter Products
  async getAllProducts(
    category?: string,
    minPrice?: number,
    maxPrice?: number,
    search?: string,
  ) {
    const query = this.productsRepository.createQueryBuilder('product');

    if (category) {
      query.andWhere('product.category = :category', { category });
    }
    if (minPrice) {
      query.andWhere('product.price >= :minPrice', { minPrice });
    }
    if (maxPrice) {
      query.andWhere('product.price <= :maxPrice', { maxPrice });
    }
    if (search) {
      query.andWhere(
        'product.name ILIKE :search OR product.description ILIKE :search',
        {
          search: `%${search}%`,
        },
      );
    }
    return query.getMany();
  }

  // Fetch a single product by ID
  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'reviews'],
    });
    if (!product)
      throw new NotFoundException(`Product with ID ${id} not found`);
    return product;
  }

  // Update a product (Admin-only)
  async updateProduct(
    id: number,
    dto: UpdateProductDTO,
    file?: Express.Multer.File,
  ): Promise<ProductResponseDto> {
    const product = await this.productsRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // update text fields
    Object.assign(product, dto);

    // update image only if new file is sent
    if (file) {
      product.imageUrl = `/uploads/products/${file.filename}`;
    }

    return this.productsRepository.save(product);
  }

  //update product
  async update(
    id: number,
    updateProductDto: UpdateProductDTO,
  ): Promise<Product> {
    const product = await this.findOne(id);

    if (updateProductDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateProductDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      product.category = category;
    }
    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  // Reduce stock after order placement
  async reduceStock(productId: number, quantity: number): Promise<void> {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.stock < quantity) {
      throw new BadRequestException(
        `Not enough stock for product: ${product.name}`,
      );
    }
    product.stock -= quantity;
    await this.productsRepository.save(product);
  }

  // Update product stock
  async updateStock(
    productId: number,
    updateProductStockDto: UpdateProductStockDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    product.stock = updateProductStockDto.stock;

    return await this.productsRepository.save(product);
  }

  // Delete a product
  async deleteProduct(id: number) {
    // const product = await this.findOne(id);
    // await this.productsRepository.remove(product);
    return this.productsRepository.update(id, { isActive: false });
  }
}

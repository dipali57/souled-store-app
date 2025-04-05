import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';


@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
  ) {}

  async findAll() {
    return this.productsRepository.find();
  }

  //Add new product
  async addProduct(createProductDto: CreateProductDTO) {
    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  async getAllProducts(category?: string, minPrice?: number, maxPrice?: number, search?: string) {
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
      query.andWhere('product.name ILIKE :search OR product.description ILIKE :search', {
        search: `%${search}%`,
      });
    }
    return query.getMany();
  }

   // Fetch a single product by ID
   async getProductById(id: number) {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

   // Update an existing product
   async updateProduct(id: number, updateProductDto: UpdateProductDTO) {
    const product = await this.getProductById(id);
    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  // Delete a product
  async deleteProduct(id: number) {
    const product = await this.getProductById(id);
    return this.productsRepository.remove(product);
  }

}




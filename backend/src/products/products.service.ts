import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';


@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
  ) {}

  async findAll() {
    return this.productsRepository.find();
  }

  async create(productData) {
    const product = this.productsRepository.create(productData);
    return this.productsRepository.save(product);
  }
}

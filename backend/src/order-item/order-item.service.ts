import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { Repository } from 'typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem) private orderItemsRepo: Repository<OrderItem>,
    private readonly productService: ProductsService,
  ) {}

  async findOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
    return this.orderItemsRepo.find({
      where: { order: { id: orderId } },
      relations: ['product'],
    });
  }

  async createOrderItems(
    createOrderItemDtos: CreateOrderItemDto[],
  ): Promise<void> {
    const orderItems: OrderItem[] = [];
    for (const createOrderItemDto of createOrderItemDtos) {
      const product = await this.productService.findOne(
        createOrderItemDto.productId,
      );
      if (!product) {
        throw new Error(
          `Product with ID ${createOrderItemDto.productId} not found`,
        );
      }

      if (product.stock < createOrderItemDto.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ID ${createOrderItemDto.productId}`,
        );
      }

      const orderItem = this.orderItemsRepo.create({
        order: { id: createOrderItemDto.orderId },
        product: { id: createOrderItemDto.productId },
        quantity: createOrderItemDto.quantity,
        price: product.price,
      });

      orderItems.push(orderItem);

      await this.productService.reduceStock(
        createOrderItemDto.productId,
        createOrderItemDto.quantity,
      );
    }

    await this.orderItemsRepo.save(orderItems);
  }
}

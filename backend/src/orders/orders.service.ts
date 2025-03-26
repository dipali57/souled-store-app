import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';


@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private ordersRepo: Repository<Order>) {}

  async getUserOrders(userId: number) {
    return this.ordersRepo.find({ where: { user: {id: userId} } });
  }

  async checkout(userId: number) {
    // Logic to calculate total price from cart and create order
    const totalPrice = 100; // Replace with real calculation
    const order = this.ordersRepo.create({ user: {id: userId}, totalPrice });
    return this.ordersRepo.save(order);
  }
}

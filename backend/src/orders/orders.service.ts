import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import { CartService } from 'src/cart/cart.service';
import { OrderItemService } from 'src/order-item/order-item.service';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) 
    private readonly ordersRepo: Repository<Order>,
    private readonly cartService: CartService,
    private readonly orderItemsService: OrderItemService,
  ) {}

  async findByUserId(user: User) {
    const orders = await this.ordersRepo.find({
      where: { user: { id: user.id } },
      relations: ['orderItems', 'orderItems.product'],
    });

    if (orders.length === 0) {
      throw new NotFoundException(
        `No orders found for this user with id ${user.id}`,
      );
    }
    return orders;
  }

  async findAllOrders() {
    return this.ordersRepo.find({
      relations: ['user', 'orderItems', 'orderItems.product'],
    });
  }

  async checkout(user: User) {
    const cart = await this.cartService.getUserCart(user);
    if (!cart || cart.cartItems.length === 0) {
      throw new NotFoundException('Cart is empty or not found');
    }

    let totalAmount = 0;
    for (const item of cart.cartItems) {
      totalAmount += item.quantity * item.product.price;
    }

    const order = this.ordersRepo.create({
      user: { id: user.id },
      totalAmount,
      status: 'Pending',
    });

    const savedOrder = await this.ordersRepo.save(order);

    const orderItemsDtos = cart.cartItems.map((cartItem) => ({
      orderId: savedOrder.id,
      productId: +cartItem.product.id,
      quantity: cartItem.quantity,
    }));

    await this.orderItemsService.createOrderItems(orderItemsDtos);
    await this.cartService.clearCart(user.id);
    const orderWithItems = await this.orderItemsService.findOrderItemsByOrderId(
      savedOrder.id,
    );
    return { ...savedOrder, orderItems: orderWithItems };
  }

  async updateOrderStatus(
    orderId: number,
    updateOrderStatusDto: UpdateOrderDto,
  ): Promise<void> {
    const { status } = updateOrderStatusDto;
    const order = await this.ordersRepo.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    order.status = status;
    await this.ordersRepo.save(order);
  }

  async hasPurchasedProduct(
    userId: number,
    productId: number,
  ): Promise<boolean> {
    const orders = await this.ordersRepo
      .createQueryBuilder('orders')
      .leftJoinAndSelect('orders.orderItems', 'orderItem')
      .where('orders.userId = :userId', { userId })
      .andWhere('orderItem.productId = :productId', { productId })
      .getMany();
    return orders.length > 0;
  }
}

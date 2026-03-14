import {
  Controller,
  Post,
  Get,
  Request,
  UseGuards,
  Patch,
  Param,
  Body,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Role } from 'src/common/enums/user-role.enum';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CheckoutDto } from './dto/checkout.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  //Fetch Login User Orders
  @Get()
  @Roles(Role.USER)
  async findByUserId(@CurrentUser() user: User) {
    return this.ordersService.findByUserId(user);
  }

  //'Fetch All Orders'
  @Get('all')
  @Roles(Role.ADMIN)
  async findAllOrders() {
    return this.ordersService.findAllOrders();
  }

  //Place an order (checkout)
  @Post('checkout')
  checkout(@CurrentUser() user: User, @Body() checkoutDto: CheckoutDto) {
    return this.ordersService.checkout(user, checkoutDto.cartItemIds);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN)
  async updateOrderStatus(
    @Param('id') id: number,
    @Body() updateOrderStatusDto: UpdateOrderDto,
  ) {
    return this.ordersService.updateOrderStatus(id, updateOrderStatusDto);
  }
}

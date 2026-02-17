import { Controller, Post, Get, Request, UseGuards, Patch, Param, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { UserRole } from 'src/common/enums/user-role.enum';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  //Fetch Login User Orders
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  async findByUserId(@CurrentUser() user:User) {
    return this.ordersService.findByUserId(user);
  }


  //'Fetch All Orders'
  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAllOrders() {
    return this.ordersService.findAllOrders();
  }

  //Place an order (checkout)
  @Post('checkout')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  async checkout(@CurrentUser() user: User) {
    return this.ordersService.checkout(user);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateOrderStatus(
    @Param('id') id: number,
    @Body() updateOrderStatusDto: UpdateOrderDto,
  ) {
    return this.ordersService.updateOrderStatus(id, updateOrderStatusDto);
  }
}

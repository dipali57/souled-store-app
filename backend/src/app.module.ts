import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { typeOrmConfigAsync } from './common/config/typeorm.config';
import { CategoryModule } from './category/category.module';
import { ReviewModule } from './review/review.module';
import { OrderItemModule } from './order-item/order-item.module';
import { CartItemsModule } from './cart-items/cart-items.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    AuthModule,
    UsersModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    CategoryModule,
    ReviewModule,
    OrderItemModule,
    CartItemsModule,
        ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
})
export class AppModule {}

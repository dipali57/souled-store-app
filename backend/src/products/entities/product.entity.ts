import { CartItem } from 'src/cart-items/entities/cart-item.entity';
import { Category } from 'src/category/entities/category.entity';
import { OrderItem } from 'src/order-item/entities/order-item.entity';
import { Review } from 'src/review/entities/review.entity';
import { Wishlist } from 'src/wishlist/entities/wishlist.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal',  { precision: 10, scale: 2 })
  price: number;

  @Column()
  stock: number;

  @Column({nullable: true})
  sku: string;

  @Column()
  imageUrl: string;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Wishlist, w => w.product)
  wishlist: Wishlist[];
}

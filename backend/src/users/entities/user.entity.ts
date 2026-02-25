import { Cart } from 'src/cart/entities/cart.entity';
import { Gender, Role } from 'src/common/enums/user-role.enum';
import { Order } from 'src/orders/entities/order.entity';
import { Review } from 'src/review/entities/review.entity';
import { Wishlist } from 'src/wishlist/entities/wishlist.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn, Index, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Index()
  @Column({unique: true})
  email: string;

  @Column({ select:false })
  password: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true
  })
  gender: Gender;

  @Column({ nullable: true })
  mobile: string;

  @Column({
  type: 'enum',
  enum: Role,
  default: Role.USER,
  })
  role: Role;

  @Column({ nullable: true })
  refreshToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Wishlist, w => w.user)
  wishlist: Wishlist[];
}

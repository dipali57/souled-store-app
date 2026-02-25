import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['user', 'product']) // prevents duplicates
export class Wishlist {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.wishlist, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Product, product => product.wishlist, { eager: true })
  product: Product;
}
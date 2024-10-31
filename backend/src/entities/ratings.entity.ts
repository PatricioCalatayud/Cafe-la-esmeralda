import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './products/product.entity';

@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: false })
  rating: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.ratings)
  user: User;

  @ManyToOne(() => Product, (product) => product.ratings, { onDelete: 'CASCADE' })
  product: Product;
}

import { Role } from "src/enum/roles.enum";
import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Testimony } from "./testimony.entity";
import { Order } from "./order.entity";
import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { Account } from "./account.entity";
import { Rating } from "./ratings.entity";

@Entity({ name: 'users'})
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  @IsNotEmpty()
  name: string;

  @Column()
  @IsEmail()
  email: string;

  @Column({ nullable: true })
  @IsOptional()
  password: string;

  @Column({ nullable: true })
  @IsOptional()
  phone: string;

  @Column({ type:'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ default: true })
  isAvailable: boolean;

  @OneToMany(() => Order, (order) => order.user)
  @JoinColumn({ name: 'orderId' })
  orders: Order[];

  @OneToMany(() => Testimony, testimony => testimony.user)
  testimonies: Testimony[];

  @OneToOne(() => Account, account => account.user)
  account: Account;
  
  @OneToMany(()=>Rating, rating=>rating.user)
  ratings: Rating[]
}
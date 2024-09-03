import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { User } from "./user.entity";

@Entity({ name: 'account' })
export class Account {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, user => user.id)
    client: User;

    @Column({ type: 'int', default: 1000000 })
    creditLimit: number;

    @Column({ type: 'int', default: 0 })
    debt: number;

    @OneToMany(() => Order, order => order.account)
    orders: Order[];
}
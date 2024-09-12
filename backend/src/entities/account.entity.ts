import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { User } from "./user.entity";
import { AccountTransaction } from "./accountTransaction.entity";

@Entity({ name: 'account' })
export class Account {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, user => user.account)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'int', default: 1000000 })
    creditLimit: number;

    @Column({ type: 'int', default: 0 })
    balance: number;

    @OneToMany(() => Order, order => order.account)
    orders: Order[];

    @OneToMany(() => AccountTransaction, accountTransaction => accountTransaction.account)
    accountTransactions: AccountTransaction[];
}
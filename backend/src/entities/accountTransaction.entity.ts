import { BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Account } from "./account.entity";
import { TransactionType } from "src/enum/accountTransactionType.enum";

@Entity({ name: 'accountTransaction' })
export class AccountTransaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int' })
    amount: number;

    @Column({ type: 'date' })
    date: Date;

    @Column({ type: 'enum', enum: TransactionType })
    type: TransactionType;

    @ManyToOne(() => Account, account => account.accountTransactions)
    account: Account;

    @BeforeInsert()
    setDefaultEventDate() {
        const currentDate = new Date();
        this.date = new Date(currentDate.setDate(currentDate.getDate() + 7));
    }
}
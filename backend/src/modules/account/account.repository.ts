import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Account } from "src/entities/account.entity";
import { AccountTransaction } from "src/entities/accountTransaction.entity";
import { TransactionType } from "src/enum/accountTransactionType.enum";
import { Repository } from "typeorm";

@Injectable()
export class AccountRepository {
    constructor(
        @InjectRepository(Account) private accountRepository: Repository<Account>,
        @InjectRepository(AccountTransaction) private transactionRepository: Repository<AccountTransaction>
    ) {}

    async getAccounts(page: number, limit: number) {
        const [data, total] = await this.accountRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            relations: { user: true }
        })

        data.map(account => delete account.user.password);
        return { data, total };
    }

    async getAccountTransactionsByUserId(id: string, page: number = 1, limit: number = 10) {
        const account = await this.accountRepository.findOne({ where: { user: { id } } });
        if (!account) throw new NotFoundException('Cuenta no encontrada');
      
        const [transactions, total] = await this.transactionRepository.findAndCount({
          where: { account },
          skip: (page - 1) * limit,
          take: limit
        });
      
        return { transactions, total, balance: account.balance };
    }

    async registerPurchase(userId: string, amount: number) {
        const account = await this.accountRepository.findOne({ where: { user: { id: userId } } });
        if(!account) throw new NotFoundException('Cuenta no encontrada.');
        if((account.balance + amount) > account.creditLimit ) throw new BadRequestException('Límite de crédito excedido.');

        const transaction = new AccountTransaction();
        transaction.type = TransactionType.PURCHASE;
        transaction.account = account;
        transaction.amount = amount;
        await this.transactionRepository.save(transaction);

        account.balance += amount;

        return this.accountRepository.save(account);
    }

    async registerDeposit(accountId: string, amount: number) {
        const account = await this.accountRepository.findOneBy({ id: accountId });
        if(!account) throw new NotFoundException(`Cuenta no encontrada. ID: ${accountId}`);

        const transaction = new AccountTransaction();
        transaction.type = TransactionType.DEPOSIT;
        transaction.account = account;
        transaction.amount = -amount;
        await this.transactionRepository.save(transaction);

        account.balance -= amount;

        return this.accountRepository.save(account);
    }
}
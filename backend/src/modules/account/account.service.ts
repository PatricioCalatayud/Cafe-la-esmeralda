import { Injectable } from "@nestjs/common";
import { AccountRepository } from "./account.repository";

@Injectable()
export class AccountService {
    constructor(private readonly accountRepository: AccountRepository) {}

    async getAccounts(page: number, limit: number) {
        return this.accountRepository.getAccounts(page, limit);
    }

    async getAccountTransactionsByUserId(id: string, page: number, limit: number) {
        return this.accountRepository.getAccountTransactionsByUserId(id, page, limit);
    }

    async registerPurchase(userId: string, amount: number) {
        return this.accountRepository.registerPurchase(userId, amount);
    }

    async registerDeposit(accountId: string, amount: number) {
        return await this.accountRepository.registerDeposit(accountId, amount);
    }
}
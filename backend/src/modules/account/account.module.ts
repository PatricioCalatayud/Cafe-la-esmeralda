import { Module } from "@nestjs/common";
import { AccountService } from "./account.service";
import { AccountRepository } from "./account.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Account } from "src/entities/account.entity";
import { AccountTransaction } from "src/entities/accountTransaction.entity";
import { AccountController } from "./account.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Account, AccountTransaction])],
    providers: [AccountService, AccountRepository],
    controllers: [AccountController],
    exports: [AccountService]
})
export class AccountModule {}
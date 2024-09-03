import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { Account } from "src/entities/account.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Account]),
    ],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService],
})

export class UsersModule {}
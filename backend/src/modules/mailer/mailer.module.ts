import { Module } from "@nestjs/common";
import { MailerService } from "./mailer.service";
import { MailerController } from "./mailer.controller";
import { OrderModule } from "../order/order.module";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [OrderModule, UsersModule],
    controllers: [MailerController],
    providers: [MailerService],
    exports: [MailerService],
})
export class MailerModule {}

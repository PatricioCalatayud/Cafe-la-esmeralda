import { Module } from "@nestjs/common";
import { OrderModule } from "../order/order.module";
import { TasksService } from "./tasks.service";
import { ScheduleModule } from "@nestjs/schedule";
import { MailerModule } from "../mailer/mailer.module";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [ScheduleModule.forRoot(), OrderModule, MailerModule, UsersModule],
    providers: [TasksService]
})
export class TasksModule {}
import { Module } from "@nestjs/common";
import { OrderModule } from "../order/order.module";
import { TasksService } from "./tasks.service";
import { TasksController } from "./tasks.controller";
import { ScheduleModule } from "@nestjs/schedule";
import { MailerModule } from "../mailer/mailer.module";

@Module({
    imports: [ScheduleModule.forRoot(), OrderModule, MailerModule],
    providers: [TasksService],
    controllers: [TasksController]
})
export class TasksModule {}
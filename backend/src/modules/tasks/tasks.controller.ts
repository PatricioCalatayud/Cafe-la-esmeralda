import { Controller, Put } from "@nestjs/common";
import { TasksService } from "./tasks.service";

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Put()
    handleExpiredOrders() {
        return this.tasksService.handleExpiredOrders();
    }
}
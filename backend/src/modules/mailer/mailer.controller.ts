import { Body, Controller, Post } from "@nestjs/common";
import { MailerService } from "./mailer.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Order } from "src/entities/order.entity";

@ApiTags('Mailing')
@Controller('mail')
export class MailerController {
    constructor(private readonly mailerService: MailerService) {}

    @Post('created')
    async sendEmailOrderCreated(@Body() data: { order: Order}) {
        return this.mailerService.sendEmailOrderCreated(data.order);
    }

    @Post('paid')
    async sendEmailOrderPaid(@Body() data: { order: Order}) {
        return this.mailerService.sendEmailOrderPaid(data.order);
    }

    @Post('expired')
    async sendEmailOrderExpired(@Body() data: { to: string, orderId: string }) {
        return await this.mailerService.sendEmailOrderExpired(data.to, data.orderId);
    }
}
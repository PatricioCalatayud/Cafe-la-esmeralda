import { Body, Controller, Post } from "@nestjs/common";
import { MailerService } from "./mailer.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Servicio de mailing')
@Controller('mail')
export class MailerController {
    constructor(private readonly mailerService: MailerService) {}

    @Post()
    async sendEmailOrderExpired(@Body() to: string) {
        return await this.mailerService.sendEmailOrderExpired(to);
    }
}
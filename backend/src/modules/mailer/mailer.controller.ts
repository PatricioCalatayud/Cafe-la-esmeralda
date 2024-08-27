import { Body, Controller, Post } from "@nestjs/common";
import { MailerService } from "./mailer.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('Mailing')
@Controller('mail')
export class MailerController {
    constructor(private readonly mailerService: MailerService) {}

    @ApiOperation({ summary: 'Mail para ordenes expiradas', description: 'Este endpoint envía un mail a un usuario que se le expiró una orden.' })
    @Post()
    async sendEmailOrderExpired(@Body() to: string) {
        return await this.mailerService.sendEmailOrderExpired(to);
    }
}
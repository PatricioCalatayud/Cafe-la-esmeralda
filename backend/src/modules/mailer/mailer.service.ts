import { Injectable } from "@nestjs/common";
import transporter from "src/config/mailer.config";
import { sendEmailOrderExpired, sendEmailPassword } from "src/helpers/mailMessages.helper";

@Injectable()
export class MailerService {
    constructor() {}

    async sendEmailPassword(to: string, subject: string, link: string) {
        const html = sendEmailPassword(link);

        const mail = { from: 'tech@robolsolutions.com', to, subject, html };

        const info = await transporter.sendMail(mail);

        if (info.messageId) {
            return { HttpCode: 201, info: info.response };
        } else throw new Error('Error al enviar el correo.');
    }

    async sendEmailOrderExpired(to: string) {
        const html = sendEmailOrderExpired();

        const mail = { from: 'tech@robolsolutions.com', to, subject: 'Orden expirada', html };

        const info = await transporter.sendMail(mail);

        if (info.messageId) {
            return { HttpCode: 201, info: info.response };
        } else throw new Error('Error al enviar el correo.');
    }
}
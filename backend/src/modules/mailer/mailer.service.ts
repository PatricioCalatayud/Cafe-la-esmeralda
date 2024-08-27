import { Injectable } from "@nestjs/common";
import transporter, { email } from "src/config/mailer.config";
import { sendEmailOrderExpired, sendEmailOrderPaid, sendEmailPassword } from "src/helpers/mailMessages.helper";
import { Order } from "src/entities/order.entity";

@Injectable()
export class MailerService {
    constructor() {}

    async sendEmailPassword(to: string, subject: string, link: string) {
        const html = sendEmailPassword(link);

        const mail = { from: email, to, subject, html };

        const info = await transporter.sendMail(mail);

        if (info.messageId) {
            return { HttpCode: 201, info: info.response };
        } else throw new Error('Error al enviar el correo.');
    }

    async sendEmailOrderExpired(to: string) {
        const html = sendEmailOrderExpired();

        const mail = { from: email, to, subject: 'Orden expirada', html };

        const info = await transporter.sendMail(mail);

        if (info.messageId) {
            return { HttpCode: 201, info: info.response };
        } else throw new Error('Error al enviar el correo.');
    }

    async sendEmailOrderPaid(order: Order) {
        const html = sendEmailOrderPaid(order);

        const mail = { from: email, to: order.user.email, subject: 'Confirmación de pago', html };

        const info = await transporter.sendMail(mail);

        if (info.messageId) {
            return { HttpCode: 200, info: info.response };
        } else throw new Error('Error al enviar el correo.');
    }
}
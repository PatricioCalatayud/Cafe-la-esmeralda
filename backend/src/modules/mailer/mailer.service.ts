import { Injectable, ParseFilePipeBuilder, UploadedFile } from "@nestjs/common";
import transporter, { email } from "src/config/mailer.config";
import { sendEmailOrderExpired, sendEmailOrderPaid, sendEmailPassword, sendEmailOrderCreated, orderReminder, sendPaymentBill } from "src/helpers/mailMessages.helper";
import { Order } from "src/entities/order.entity";

@Injectable()
export class MailerService {
    constructor() {}

    async sendEmailPassword(to: string, link: string) {
        const html = sendEmailPassword(link);

        const mail = { from: email, to, subject: 'Recuperación de Contraseña', html };

        const info = await transporter.sendMail(mail);

        if (info.messageId) {
            return { HttpCode: 200, info: info.response };
        } else throw new Error('Error al enviar el correo.');
    }

    async sendEmailOrderCreated(order: Order) {
        const html = sendEmailOrderCreated(order);

        const mail = { from: email, to: order.user.email, subject: 'Datos de tu pedido', html };
        
        const info = await transporter.sendMail(mail);

        if (info.messageId) {
            return { HttpCode: 200, info: info.response };
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

    async sendEmailOrderExpired(to: string, orderId: string) {
        const html = sendEmailOrderExpired(orderId);

        const mail = { from: email, to, subject: 'Orden expirada', html };

        const info = await transporter.sendMail(mail);

        if (info.messageId) {
            return { HttpCode: 200, info: info.response };
        } else throw new Error('Error al enviar el correo.');
    }

    async orderReminder(to: string) {
        const html = orderReminder();

        const mail = { from: email, to, subject: 'Recordatorio de orden semanal', html };

        const info = await transporter.sendMail(mail);

        if (info.messageId) {
            return { HttpCode: 200, info: info.response };
        } else throw new Error('Error al enviar el correo.');
    }

    async sendPaymentBill(to: string, imgUrl: string) {
        const html = sendPaymentBill(imgUrl);

        const mail = { from: email, to, subject: 'Comprobante de factura', html };

        const info = await transporter.sendMail(mail);

        if (info.messageId) {
            return { HttpCode: 200, info: info.response };
        } else throw new Error('Error al enviar el correo.');
    }
}
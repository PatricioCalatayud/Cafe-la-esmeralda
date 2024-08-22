import { Injectable } from "@nestjs/common";
import transporter from "src/config/mailer.config";
import { sendEmailPassword } from "src/helpers/mailMessages.helper";

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

    async sendEmailOrderExpired(to: string, subject: string) {
        const html = 'Lo sentimos, tu orden ha caducado. Puedes volver a crear una desde la página.' // ACÁ VIENE EL HTML DEL HELPER

        const mail = { from: 'tech@robolsolutions.com', to, subject, html };

        const info = await transporter.sendMail(mail);

        if (info.messageId) {
            return { HttpCode: 201, info: info.response };
        } else throw new Error('Error al enviar el correo.');
    }
}
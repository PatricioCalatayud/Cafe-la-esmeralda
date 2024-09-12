import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { orderRepository } from '../order/order.repository';
import { MailerService } from '../mailer/mailer.service';
import { UsersService } from '../users/users.service';
import * as moment from 'moment';

@Injectable()
export class TasksService {
    constructor(
        private readonly orderRepository: orderRepository,
        private readonly mailerService: MailerService,
        private readonly usersService: UsersService
    ) {}

    @Cron('*/1 * * * *') // este después se cambia a 0 16 */2 * * para que revise cada 2 días a las 16hs
    async handleExpiredOrders() {
        const ordersUnpaid = await this.orderRepository.getUnpaidOrders();
        if(ordersUnpaid.length === 0) {
            console.log('No hay ordenes sin pagar.');
            return 'No hay ordenes sin pagar.';
        }

        
        for(const order of ordersUnpaid) {
            try {
                await this.mailerService.sendEmailOrderExpired(order.user.email, order.id);
                await this.orderRepository.deleteOrder(order.id);
            } catch (error) {
                console.log(`Error al procesar la orden ${order.id}: ${error.message}`);
            }
        }

        console.log(`Se chequearon las ordenes sin pagar. ${ordersUnpaid.length} ordenes borradas de la base de datos.`);
        return `Se chequearon las ordenes sin pagar. ${ordersUnpaid.length} ordenes borradas de la base de datos.`;
    }

    @Cron('*/1 * * * *')
    async handleOrderReminder() {
        const clients = await this.usersService.getClients();
        const lastSunday = moment().subtract(1, 'week').day(0).add(7, 'days').toDate();

        let sentEmails = 0;
        for(let client of clients) {
            if(client.orders.length === 0 || (client.orders[client.orders.length-1].date < lastSunday)) {
                const emailResponse = await this.mailerService.orderReminder(client.email);
                if(emailResponse.HttpCode === 200) sentEmails++;
            }
        }

        console.log(`Emails enviados: ${sentEmails}`);
    }
}
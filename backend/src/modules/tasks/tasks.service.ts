import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderService } from '../order/order.service';
import { MailerService } from '../mailer/mailer.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class TasksService {
    constructor(
        private readonly orderService: OrderService,
        private readonly mailerService: MailerService,
        private readonly usersService: UsersService
    ) {}

    @Cron(CronExpression.EVERY_DAY_AT_4PM)
    async handleExpiredOrders() {
        const ordersUnpaid = await this.orderService.getUnpaidOrders();
        if(ordersUnpaid.length === 0) {
            console.log('No hay ordenes sin pagar.');
            return 'No hay ordenes sin pagar.';
        }

        for(const order of ordersUnpaid) {
            try {
                await this.mailerService.sendEmailOrderExpired(order.user.email, order.id);
                await this.orderService.deleteOrder(order.id);
            } catch (error) {
                console.log(`Error al procesar la orden ${order.id}: ${error.message}`);
            }
        }

        console.log(`Se chequearon las ordenes sin pagar. ${ordersUnpaid.length} ordenes borradas de la base de datos.`);
        return `Se chequearon las ordenes sin pagar. ${ordersUnpaid.length} ordenes borradas de la base de datos.`;
    }

    @Cron(CronExpression.EVERY_DAY_AT_7PM)
    async handleOrderReminder() {
        const today = new Date();
        const dayOfWeek = today.getDay(); // busco el día de la semana, por ejemplo lunes = 1 o jueves = 4
        
        if(dayOfWeek === 1 || dayOfWeek === 4) {
            const clients = await this.usersService.getClients();
    
            const dayToCompare = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (dayOfWeek)); // día de comparación, comparando hasta el domingo anterior
    
            let sentEmails = 0;
            for(const client of clients) {
                const lastOrderDate = client.orders.length > 1 ? client.orders[client.orders.length-1].date : null; // sacamos la fecha de la última orden
    
                if(!lastOrderDate || lastOrderDate < dayToCompare) {
                    const emailResponse = await this.mailerService.orderReminder(client.email);
                    if(emailResponse.HttpCode === 200) sentEmails++;
                }
            }
    
            console.log(`Emails enviados: ${sentEmails}`);
        }
    }
}
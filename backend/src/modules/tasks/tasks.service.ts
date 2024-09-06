import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { orderRepository } from '../order/order.repository';
import { MailerService } from '../mailer/mailer.service';
import { sendEmailOrderExpired } from 'src/helpers/mailMessages.helper';

@Injectable()
export class TasksService {
    constructor(
        private readonly orderRepository: orderRepository,
        private readonly mailerService: MailerService
    ) {}

    @Cron('*/1 * * * *') // 0 16 */2 * *
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
}
import { Body, Injectable } from '@nestjs/common';
import { preference, payment } from 'src/config/mercadopago.config';
import { PaymentDto } from './payment.dto';
import { OrderService } from '../order/order.service';

@Injectable()
export class MercadoPagoService {
  constructor(private readonly orderService: OrderService) {}

  async createPayment(data: PaymentDto) {
    try {
      const response = await preference.create({
        body: {
          items: [
            {
              id: '1',
              title: 'Cafetería La Esmeralda',
              quantity: 1,
              unit_price: data.price
            }
          ],
          payment_methods: { excluded_payment_types: [{ id: 'ticket' }] },
          back_urls: {
          success: 'https://cafe-la-esmeralda.vercel.app',
          failure: 'https://cafe-la-esmeralda.vercel.app'
          },
          notification_url: 'https://a076-2800-810-434-680-7859-b9cf-4d33-276c.ngrok-free.app/mercadopago/webhook',
          payer: { name: data.orderId }
        }
        
      });
      console.log(data.price)
      return response.init_point;
    } catch (error) {
      throw new Error(`Error creando el pago. ERROR: ${error.message}`);
    }
  }

  async webhook(paid) {
    if(paid.type == 'payment') {
      const data = await payment.get({ id: paid.data.id });
      
      if(data.status === 'approved') {
        const order = await this.orderService.getOrderById(data.additional_info.payer.first_name);
        
        (await order).status = 'Pagado';
        console.log(order); // ACÁ VA EL UPDATE A ORDER
      }
    }
  }
}
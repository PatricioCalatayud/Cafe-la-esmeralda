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
          success: `https://cafe-la-esmeralda.vercel.app/PaymentSuccess/?orderId=${data.orderId}`,
          failure: `https://cafe-la-esmeralda.vercel.app/PaymentFailure/?orderId=${data.orderId}`
          },
          notification_url: 'https://cafeteriaesmeralda.onrender.com/mercadopago/webhook',
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
        const orderId = data.additional_info.payer.first_name;
        
        this.orderService.MercadoPagoUpdate(orderId);

        return { HttpCode: 200 }
      }
    }
  }
}
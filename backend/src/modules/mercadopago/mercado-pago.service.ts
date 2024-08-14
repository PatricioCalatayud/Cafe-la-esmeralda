import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './create-payment.dto';
import { preference } from 'src/config/mercadopago.config';

@Injectable()
export class MercadoPagoService {
  constructor() {}

  async createPayment(createPaymentDto: any) {
    try {
      const items = createPaymentDto.items || [];

      const response = await preference.create({
        body: {
          items: items.map(item => ({
              title: item.title,
              description: item.description,
              quantity: item.quantity,
              unit_price: item.unit_price,
          })),
        },
      });

      console.log(response);
      
      return response.init_point;
    } catch (error) {
      throw new Error(`Error creando el pago. ERROR: ${error.message}`);
    }
  }
}

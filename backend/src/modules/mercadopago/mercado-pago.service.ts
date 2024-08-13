import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './create-payment.dto';
import { preference } from 'src/config/mercadopago.config';

@Injectable()
export class MercadoPagoService {
  constructor() {}

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<any> {
    /* try {
      const items = createPaymentDto.items || [];

      const response = await preference.create({
        body: {
          items: items.map(item => ({ ESTO ESTÁ PESIMO, MAL, MUY MAL.
              title: item.title,
              description: item.description,
              quantity: item.quantity,
              unit_price: item.unit_price,
          })),
        },
      });
    
      console.log("response: ", response, "Fin de response");
      
      
      return response;
    } catch (error) {
      throw new Error(`Error creating payment: ${error.message}`);
    } */
  }
}

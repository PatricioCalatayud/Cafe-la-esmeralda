import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { MercadoPagoService } from "./mercado-pago.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { PaymentDto } from "./payment.dto";

@ApiTags('Mercado Pago')
@Controller('mercadopago')
export class MercadoPagoController {
  constructor(private readonly mercadoPagoService: MercadoPagoService) {}

  @ApiOperation({ summary: 'Crea una orden de pago.', description: 'Este endpoint retorna una URL de orden de pago de Mercado Pago.' })
  @Post('url-process')
  async createPayment(@Body() data: PaymentDto) {
    return await this.mercadoPagoService.createPayment(data);
  }

  @ApiOperation({ summary: 'Guarda y asocia un pago exitoso en Mercado Pago.', description: 'Este endpoint guarda y asocia al usuario un pago exitoso de Mercado Pago en la base de datos.' })
  @Post('webhook')
  async webhook(@Body() paid) {
    return this.mercadoPagoService.webhook(paid);
  }
}
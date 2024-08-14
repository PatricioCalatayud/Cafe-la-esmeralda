import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { MercadoPagoService } from "./mercado-pago.service";
import { CreatePaymentDto } from "./create-payment.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('Mercado Pago')
@Controller('mercadopago')
export class MercadoPagoController {
  constructor(private readonly mercadoPagoService: MercadoPagoService) {}

  @ApiOperation({ summary: 'Crea una orden de pago.', description: 'Este endpoint retorna una URL de orden de pago de Mercado Pago.' })
  @Post('url-process')
  async createPayment(@Body(new ValidationPipe()) createPaymentDto: any) {
    console.log('DTO recibido:', createPaymentDto); // DEJAMOS POR EL MOMENTO PARA REVISAR

    return await this.mercadoPagoService.createPayment(createPaymentDto);
  }
}
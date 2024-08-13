import { BadRequestException, Body, Controller, Get, Param, Post, Redirect, ValidationPipe } from "@nestjs/common";
import { MercadoPagoService } from "./mercado-pago.service";
import { CreatePaymentDto } from "./create-payment.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
@ApiTags('Pasarela de pago')
@Controller('market-pay')
export class MercadoPagoController {
    constructor(private readonly mercadoPagoService: MercadoPagoService) {}
  @ApiOperation({
    summary: 'Crea un pago en Mercado Pago',
    description:
        'Desde este endpoint se crea un link de pago a Mercado Pago.'
  })
  @Post('url-proccess')
  async createPayment(@Body(new ValidationPipe()) createPaymentDto: CreatePaymentDto): Promise<any> {
    console.log('Received DTO:', createPaymentDto);
    try {
        return await this.mercadoPagoService.createPayment(createPaymentDto);
      } catch (error) {
        throw new Error(`Error creating payment: ${error.message}`);
      }
  }

}

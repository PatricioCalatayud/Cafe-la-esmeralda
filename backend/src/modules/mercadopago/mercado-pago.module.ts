import { Module } from "@nestjs/common";
import { MercadoPagoService } from "./mercado-pago.service";
import { MercadoPagoController } from "./mercado-pago.controller";
import { OrderModule } from "../order/order.module";
import { MailerModule } from "../mailer/mailer.module";

@Module({
    imports: [OrderModule, MailerModule],
    providers: [MercadoPagoService],
    controllers: [MercadoPagoController]
})

export class MercadoPagoModule {}
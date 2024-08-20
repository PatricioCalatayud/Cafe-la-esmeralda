import { Module } from "@nestjs/common";
import { MercadoPagoService } from "./mercado-pago.service";
import { MercadoPagoController } from "./mercado-pago.controller";
import { OrderModule } from "../order/order.module";

@Module({
    imports: [OrderModule],
    providers: [MercadoPagoService],
    controllers: [MercadoPagoController],
    exports: [],
})

export class MercadoPagoModule {}
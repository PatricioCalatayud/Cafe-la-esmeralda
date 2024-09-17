import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Bill } from "src/entities/bill.entity";
import { BillController } from "./bill.controller";
import { BillService } from "./bill.service";
import { BillRepository } from "./bill.repository";
import { Order } from "src/entities/order.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Bill, Order])],
    controllers: [BillController],
    providers: [BillService, BillRepository],
    exports: [BillService]
})
export class BillModule {}
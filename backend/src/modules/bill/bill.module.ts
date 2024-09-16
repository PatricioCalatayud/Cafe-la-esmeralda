import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Bill } from "src/entities/bill.entity";
import { BillController } from "./bill.controller";
import { BillService } from "./bill.service";
import { BillRepository } from "./bill.repository";

@Module({
    imports: [TypeOrmModule.forFeature([Bill])],
    controllers: [BillController],
    providers: [BillService, BillRepository],
    exports: [BillService]
})
export class BillModule {}
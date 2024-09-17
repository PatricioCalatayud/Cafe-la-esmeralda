import { Injectable } from "@nestjs/common";
import { BillRepository } from "./bill.repository";
import { Bill } from "src/entities/bill.entity";

@Injectable()
export class BillService {
    constructor(private readonly billRepository: BillRepository) {}

    async getBills(page: number, limit: number, filter: boolean): Promise<{ data: Bill[], total: number}> {
        return await this.billRepository.getBills(page, limit, filter);
    }

    async getBillById(id: string) {
        return await this.billRepository.getBillById(id);
    }

    async createBill(orderId: string, type: string) {
        return await this.billRepository.createBill(orderId, type);
    }

    async updateBill(id: string, imgUrl: string) {
        return await this.billRepository.updateBill(id, imgUrl);
    }

    async deleteBill(id: string) {
        return await this.billRepository.deleteBill(id);
    }
}
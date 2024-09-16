import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Bill } from "src/entities/bill.entity";
import { Repository } from "typeorm";

@Injectable()
export class BillRepository {
    constructor(@InjectRepository(Bill) private readonly billRepository: Repository<Bill>) {}

    async getBills(page: number, limit: number): Promise<{ data: Bill[], total: number}> {
        const [data, total] = await this.billRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            relations: ['order']
        })

        return { data, total };
    }

    async getBillById(id: string) {
        const bill = await this.billRepository.findOneBy({ id });
        if(!bill) throw new NotFoundException(`Factura no encontrada. ID: ${id}`);

        return bill;
    }

    async createBill(orderId: string, type: string) {
        const bill = new Bill();
        bill.order = orderId;
        bill.type = type;

        return await this.billRepository.save(bill);
    }

    async updateBill(id: string, imgUrl: string) {
        return this.billRepository.update(id, { imgUrl });
    }

    async deleteBill(id: string) {
        const result = await this.billRepository.delete(id);
        if(result.affected === 0) throw new NotFoundException(`Factura no encontrada. ID: ${id}`);

        return { message: `La factura con id ${id} fue eliminada permanentemente.` };
    }
}
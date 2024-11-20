import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Bill } from "src/entities/bill.entity";
import { Order } from "src/entities/order.entity";
import { IsNull, Not, Repository } from "typeorm";

@Injectable()
export class BillRepository {
    constructor(
        @InjectRepository(Bill) private readonly billRepository: Repository<Bill>,
        @InjectRepository(Order) private readonly orderRepository: Repository<Order>
    ) {}

    async getBills(page: number, limit: number, filter: boolean): Promise<{ data: Bill[], total: number}> {
        const skip = (page - 1) * limit;
        let data: Bill[];
        let total: number;

        if (filter === true) [data, total] = await this.billRepository.findAndCount({ where: { imgUrl: Not(IsNull()) }, skip: skip, take: limit, relations: ['order']});
        if (filter === false) [data, total] = await this.billRepository.findAndCount({ where: { imgUrl: IsNull() }, skip: skip, take: limit, relations: ['order']});
        if (filter === null) [data, total] = await this.billRepository.findAndCount({ skip: skip, take: limit, relations: ['order'] });

        return { data, total };
    }

    async getBillById(id: string) {
        const bill = await this.billRepository.findOne({ where: { id }, relations: ['order'] });
        if(!bill) throw new NotFoundException(`Factura no encontrada. ID: ${id}`);

        return bill;
    }

    async createBill(orderId: string, type: string, identification: string)  {
        const bill = new Bill();
        bill.order = orderId;
        bill.type = type;
        bill.identification = identification;

        return await this.billRepository.save(bill);
    }

    async updateBill(id: string, imgUrl: string | null) {
        return this.billRepository.update(id, { imgUrl });
    }

    async deleteBill(id: string) {
        const order = await this.orderRepository.findOne({ where: { bill: { id } } });
        await this.orderRepository.update(order.id, { bill: null });

        const result = await this.billRepository.delete(id);
        if(result.affected === 0) throw new NotFoundException(`Factura no encontrada. ID: ${id}`);

        return { message: `La factura con id ${id} fue eliminada permanentemente.` };
    }
}
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "src/entities/order.entity";
import { LessThan, Repository } from "typeorm";
import { subDays } from 'date-fns';

Injectable()
export class orderRepository {
    constructor(@InjectRepository(Order) private orderRepository: Repository<Order>) {}

    async getUnpaidOrders(): Promise<Order[]> {
        return await this.orderRepository.find({ where: { orderStatus: false, date: LessThan(subDays(new Date(), 2)) }, relations: ['user'] });
    }

    async deleteOrder(id: string): Promise<{ message: string }> {
        const result = await this.orderRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException(`No se encontró el producto. ID: ${id}`);
    
        return { message: `La orden con id ${id} fue eliminada permanentemente.` };
    }
}
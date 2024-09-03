import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { OrderDetail } from 'src/entities/orderdetail.entity';
import { DataSource, Repository } from 'typeorm';
import { ProductInfo, UpdateOrderDto } from './order.dto';
import { User } from 'src/entities/user.entity';
import { ProductsOrder } from 'src/entities/product-order.entity';
import { Transaccion } from 'src/entities/transaction.entity';
import { Subproduct } from 'src/entities/products/subproduct.entity';
import { MailerService } from '../mailer/mailer.service';
import { Receipt } from 'src/entities/receipt.entity';
import { AccountService } from '../account/account.service';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderDetail) private readonly orderDetailRepository: Repository<OrderDetail>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Transaccion) private readonly transactionRepository: Repository<Transaccion>,
        @InjectRepository(Receipt) private readonly receiptRepository: Repository<Receipt>,
        @InjectRepository(Subproduct) private readonly subproductRepository: Repository<Subproduct>,
        private readonly dataSource: DataSource,
        private readonly mailerService: MailerService,
        private readonly accountService: AccountService
    ) {}

    async getOrders(page: number, limit: number): Promise<{ data: Order[], total: number }> {
        const [data, total] = await this.orderRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            relations: [
                'user',
                'productsOrder',
                'productsOrder.subproduct',
                'productsOrder.subproduct.product',
                'orderDetail',
                'orderDetail.transactions',
                'receipt'
            ],
        });
    
        return { data, total };
    }
    
    async getOrderById(id: string) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: [
                'user',
                'productsOrder',
                'productsOrder.subproduct',
                'productsOrder.subproduct.product',
                'orderDetail',
                'orderDetail.transactions',
                'receipt'
            ],
        });
    
        if (!order) throw new NotFoundException(`Orden no encontrada. ID: ${id}`);
        
        if (order.user) {
            delete order.user.password;
        }
    
        return order;
    }

    async getOrdersByUserId(id: string, page: number, limit: number): Promise<{ data: Order[], total: number }> {
        const user = await this.userRepository.findOne({
            where: { id },
        });
    
        if (!user) throw new BadRequestException(`Usuario no encontrado. ID: ${id}`);
    
        const [data, total] = await this.orderRepository.findAndCount({
            where: { 
                user: { id: user.id }
                },
            relations: [
                'productsOrder',
                'productsOrder.subproduct',
                'productsOrder.subproduct.product',
                'orderDetail',
                'orderDetail.transactions',
                'receipt'
            ],
            skip: (page - 1) * limit,
            take: limit,
        });
    
        return { data, total };
    }
    async createOrder(userId: string, productsInfo: ProductInfo[], address: string | undefined, account?: string) {
        let total = 0;
        let createdOrder;
    
        const user = await this.userRepository.findOneBy({ id: userId});
    
        await this.dataSource.transaction(async (transactionalEntityManager) => {
            const order = transactionalEntityManager.create(Order, { user, date: new Date() });
            const newOrder = await transactionalEntityManager.save(order);
            createdOrder = newOrder;
    
            await Promise.all(productsInfo.map(async (product) => {
                await this.updateStock(product.subproductId, product.quantity);
    
                const foundSubproduct = await transactionalEntityManager.findOneBy(Subproduct, { id: product.subproductId });
                if (!foundSubproduct) throw new BadRequestException(`Subproducto no encontrado. ID: ${product.subproductId}`);
                if (foundSubproduct.stock <= 0) throw new BadRequestException(`Subproducto sin stock. ID: ${foundSubproduct.id}`);
    
                total += (foundSubproduct.price * product.quantity * (1 - (foundSubproduct.discount/100)));
    
                const productsOrder = transactionalEntityManager.create(ProductsOrder, {
                    subproduct: foundSubproduct,
                    order: newOrder,
                    quantity: product.quantity
                });
    
                await transactionalEntityManager.save(ProductsOrder, productsOrder);
            }));
    
            const orderDetail = transactionalEntityManager.create(OrderDetail, {
                totalPrice: Number(total.toFixed(2)),
                order: newOrder,
                addressDelivery: address || 'Retiro en local',
            });
    
            await transactionalEntityManager.save(OrderDetail, orderDetail);
    
            await transactionalEntityManager.save(Transaccion, {
                status: account === 'Cuenta corriente' ? 'En preparación' : 'Pendiente de pago',
                timestamp: new Date(),
                orderdetail: orderDetail
            });

            if(account === 'Transferencia') {
                const receipt = await transactionalEntityManager.save(Receipt, { order: newOrder.id });
                newOrder.receipt = receipt;
                await transactionalEntityManager.save(newOrder);
            }
            
            if(account === 'Cuenta corriente') await this.accountService.registerPurchase(userId, orderDetail.totalPrice);
        });
  
        delete createdOrder.user.password;
        return createdOrder;
    }
    
    async updateOrder(id: string, data: UpdateOrderDto) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: [
                'productsOrder',
                'productsOrder.subproduct',
                'orderDetail',
                'orderDetail.transactions']
        });
        if (!order) throw new NotFoundException('Orden no encontrada');

        if(data.orderStatus) {
            await this.orderRepository.update(
                { id: order.id },
                { orderStatus: true }
            )

            await this.mailerService.sendEmailOrderPaid(order);
        }

        if(data.deliveryDate) await this.orderDetailRepository.update({ id: order.orderDetail.id }, { deliveryDate: data.deliveryDate });

        if(data.status) await this.transactionRepository.update({ id: order.orderDetail.transactions.id }, { status: data.status, timestamp: new Date() });

        if(data.transferStatus) await this.receiptRepository.update({ id: order.receipt.id }, { status: data.transferStatus });

        return { HttpCode: 200 };
    }

    async updateStock(subproductId: string, quantity: number) {
        const subproduct = await this.subproductRepository.findOne({ where: { id: subproductId } });
        if (!subproduct) throw new BadRequestException(`Subproducto no encontrado. ID: ${subproductId}`);
        
        await this.subproductRepository.update({ id: subproductId }, { stock: subproduct.stock - quantity });
    }

    async deleteOrder(id: string): Promise<{ message: string }> {
        const result = await this.orderRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException(`No se encontró el producto. ID: ${id}`);
    
        return { message: `La orden con id ${id} fue eliminada permanentemente.` };
    }
}
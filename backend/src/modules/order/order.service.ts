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
import { OrderQuery } from './orders.query';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderDetail) private readonly orderDetailRepository: Repository<OrderDetail>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Transaccion) private readonly transactionRepository: Repository<Transaccion>,
        @InjectRepository(ProductsOrder) private readonly productsOrderRepository: Repository<ProductsOrder>,
        @InjectRepository(Subproduct) private readonly subproductRepository: Repository<Subproduct>,
        private readonly dataSource: DataSource,
        private readonly orderQuery: OrderQuery,
        private readonly mailerService: MailerService
    ) {}

    async getOrders(page: number, limit: number): Promise<{ data: Order[], total: number }> {
        const [data, total] = await this.orderRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            relations: [
                'user',
                'productsOrder',
                'productsOrder.subproduct',
                'orderDetail',
                'orderDetail.transactions',
            ],
        });
    
        return { data, total };
    }
    

    async getOrderById(id: string) {
        const foundOrder = await this.orderQuery.getOrderById(id);
        if(!foundOrder) throw new NotFoundException(`Orden no encontrada. ID: ${id}`);

        return foundOrder;
    }

    async getOrdersByUserId(id: string, page: number, limit: number): Promise<{ data: Order[], total: number }> {
        const user = await this.userRepository.findOneBy({ id, isDeleted: false });   
        if (!user) throw new BadRequestException(`Usuario no encontrado. ID: ${id}`);

        const [data, total] = await this.orderRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            where: { user }
        })
      
        return { data, total };
    }

    async createOrder(userId: string, productsInfo: ProductInfo[], address: string | undefined, account: boolean) {
        let total = 0;
        let createdOrder;
    
        const user = await this.userRepository.findOneBy({ id: userId, isDeleted: false });
    
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
                status: account ? 'En preparación' : 'Pendiente de pago',
                timestamp: new Date(),
                orderdetail: orderDetail
            });
        });
  
        delete createdOrder.user.password;
        return createdOrder;
    }
    
    async updateOrder(id: string, data: UpdateOrderDto) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['productsOrder', 'productsOrder.product', 'orderDetail', 'orderDetail.transactions']
        });
        if (!order) throw new NotFoundException('Orden no encontrada');

        if(data.orderStatus) {
            await this.orderRepository.update(
                { id: order.id },
                { orderStatus: true }
            )

            await this.mailerService.sendEmailOrderPaid(order);
        }

        await this.orderDetailRepository.update(
            { id: order.orderDetail.id },
            { deliveryDate: data.deliveryDate }
        );

        await this.transactionRepository.update({ id: order.orderDetail.transactions.id }, { status: data.status });

        return { HttpCode: 200 };
    }

    async updateStock(subproductId: string, quantity: number) {
        const subproduct = await this.subproductRepository.findOne({ where: { id: subproductId } });
        if (!subproduct) throw new BadRequestException(`Subproducto no encontrado. ID: ${subproductId}`);
        
        await this.subproductRepository.update({ id: subproductId }, { stock: subproduct.stock - quantity });
    
    }
    
    async deleteOrder(id: string) {
        const foundOrder = await this.getOrderById(id);
        if (!foundOrder) throw new NotFoundException(`Orden no encontrada. ID: ${id}`);

        await this.orderRepository.update(id, { isDeleted: true });

        return foundOrder;
    }
}

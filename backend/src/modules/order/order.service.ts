import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { OrderDetail } from 'src/entities/orderdetail.entity';
import { DataSource, Repository } from 'typeorm';
import { ProductInfo, UpdateOrderDto } from './order.dto';
import { User } from 'src/entities/user.entity';
import { Product } from 'src/entities/products/product.entity';
import { ProductsOrder } from 'src/entities/product-order.entity';
import { Transaccion } from 'src/entities/transaction.entity';
import { Subproduct } from 'src/entities/products/subprodcut.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderDetail) private readonly orderDetailRepository: Repository<OrderDetail>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        @InjectRepository(Transaccion) private readonly transactionRepository: Repository<Transaccion>,
        @InjectRepository(ProductsOrder) private readonly productsOrderRepository: Repository<ProductsOrder>,
        @InjectRepository(Subproduct) private readonly subproductRepository: Repository<Subproduct>,
        private readonly dataSource: DataSource
    ) {}

    async getOrders(page: number, limit: number) {
        const skip = (page - 1) * limit;
        return await this.orderRepository
            .createQueryBuilder('orders')
            .leftJoinAndSelect('orders.user', 'user')
            .leftJoinAndSelect('orders.productsOrder', 'productsOrder')
            .leftJoinAndSelect('productsOrder.product', 'products')
            .leftJoinAndSelect('orders.orderDetail', 'orderDetails')
            .leftJoinAndSelect('orderDetails.transactions', 'transaction')
            .where('orders.isDeleted = :isDeleted', { isDeleted: false })
            .skip(skip)
            .take(limit)
            .select([
                'user.id',
                'user.name',
                'orders.id',
                'orders.date',
                'orderDetails.totalPrice',
                'orderDetails.deliveryDate',
                'transaction.status',
                'transaction.timestamp',
                'productsOrder.quantity',
                'productsOrder.id',
                'products.id',
                'products.description',
                'products.price',
                'products.discount',
                'products.imgUrl',
            ])
            .getMany();
    }

    async getOrderById(id: string) {
        const order = await this.orderRepository
            .createQueryBuilder('orders')
            .leftJoinAndSelect('orders.user', 'user')
            .leftJoinAndSelect('orders.productsOrder', 'productsOrder')
            .leftJoinAndSelect('productsOrder.product', 'products')
            .leftJoinAndSelect('orders.orderDetail', 'orderDetails')
            .leftJoinAndSelect('orderDetails.transactions', 'transaction')
            .where('orders.id = :orID', { orID: id })
            .andWhere('orders.isDeleted = :isDeleted', { isDeleted: false })
            .select([
                'user.id',
                'user.name',
                'orders.id',
                'orders.date',
                'orderDetails.totalPrice',
                'orderDetails.deliveryDate',
                'transaction.status',
                'transaction.timestamp',
                'productsOrder.quantity',
                'products.id',
                'products.description',
                'products.price',
                'products.discount',
                'products.imgUrl',
            ])
            .getOne();

        if (!order) throw new NotFoundException(`Orden no encontrada. ID: ${id}`);
        return order;
    }

    async getOrdersByUserId(id: string, page: number, limit: number) {
        const skip = (page - 1) * limit;

        return await this.orderRepository
            .createQueryBuilder('orders')
            .leftJoinAndSelect('orders.user', 'user')
            .leftJoinAndSelect('orders.productsOrder', 'productsOrder')
            .leftJoinAndSelect('productsOrder.product', 'products')
            .leftJoinAndSelect('orders.orderDetail', 'orderDetails')
            .leftJoinAndSelect('orderDetails.transactions', 'transaction')
            .where('user.id = :orID', { orID: id })
            .andWhere('orders.isDeleted = :isDeleted', { isDeleted: false })
            .skip(skip)
            .take(limit)
            .select([
                'user.id',
                'user.name',
                'orders.id',
                'orders.date',
                'orderDetails.totalPrice',
                'orderDetails.deliveryDate',
                'transaction.status',
                'transaction.timestamp',
                'productsOrder.quantity',
                'productsOrder.id',
                'products.id',
                'products.description',
                'products.price',
                'products.discount',
                'products.imgUrl',
            ])
            .getMany();
    }

    async createOrder(userId: string, productsInfo: ProductInfo[], address: string | undefined, account: boolean) {
        let total = 0;
        let createdOrder;
    
        const user = await this.userRepository.findOneBy({ id: userId, isDeleted: false });
        if (!user) throw new BadRequestException(`Usuario no encontrado. ID: ${userId}`);
    
        await Promise.all(productsInfo.map(async (product) => {
            const foundSubproduct = await this.subproductRepository.findOne({
                where: { id: product.subproductId },
                relations: ['product']
            });
            if (!foundSubproduct) throw new BadRequestException(`Subproducto no encontrado. ID: ${product.subproductId}`);
            if (foundSubproduct.stock <= 0) throw new BadRequestException(`Subproducto sin stock. ID: ${foundSubproduct.id}`);
        }));
    
        await this.dataSource.transaction(async (transactionalEntityManager) => {
            const order = transactionalEntityManager.create(Order, { user, date: new Date() });
            const newOrder = await transactionalEntityManager.save(order);
            createdOrder = newOrder;
    
            await Promise.all(productsInfo.map(async (product) => {
                await this.updateStock(product.subproductId);
    
                const foundSubproduct = await transactionalEntityManager.findOneBy(Subproduct, { id: product.subproductId });
                if (!foundSubproduct) throw new BadRequestException(`Subproducto no encontrado. ID: ${product.subproductId}`);
    
                total += ((foundSubproduct.price * product.quantity) * (1 - foundSubproduct.discount));
    
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
        console.log(createdOrder);
        return createdOrder;
    }
    
    async updateOrder(id: string, data: UpdateOrderDto) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['productsOrder', 'productsOrder.product', 'orderDetail', 'orderDetail.transactions']
        });
        if (!order) throw new NotFoundException('Orden no encontrada');

        await this.orderDetailRepository.update(
            { id: order.orderDetail.id },
            { deliveryDate: data.deliveryDate }
        );

        await this.transactionRepository.update({ id: order.orderDetail.transactions.id }, { status: data.status });

        return { HttpCode: 200 };
    }

    async MercadoPagoUpdate(id: string) {
        const foundOrder = await this.orderRepository.findOne(
            {
                where: { id },
                relations: { orderDetail: { transactions: true } }
            });
        if (!foundOrder) throw new BadRequestException(`Orden no encontrada. ID: ${id}`);

        await this.orderRepository.update(id, { status: 'Pagado' });
        await this.transactionRepository.update({ id: foundOrder.orderDetail.transactions.id }, { status: 'En preparación' });

        return { HttpCode: 200 };
    }

    async deleteOrder(id: string) {
        const foundOrder = await this.getOrderById(id);
        if (!foundOrder) throw new NotFoundException(`Orden no encontrada. ID: ${id}`);

        await this.orderRepository.update(id, { isDeleted: true });

        return foundOrder;
    }

    async updateStock(subproductId: string) {
        const subproduct = await this.subproductRepository.findOne({ where: { id: subproductId } });
        if (!subproduct) throw new BadRequestException(`Subproducto no encontrado. ID: ${subproductId}`);
        
        await this.subproductRepository.update({ id: subproductId }, { stock: subproduct.stock - 1 });
    }
    
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { OrderDetail } from 'src/entities/orderdetail.entity';
import { DataSource, Repository } from 'typeorm';
import { ProductInfo, UpdateOrderDto } from './order.dto';
import { User } from 'src/entities/user.entity';
import { Product } from 'src/entities/products/product.entity';
import { ProductsOrder } from 'src/entities/product-order.entity';
import { OrderQuery } from './orders.query';
import { Transaccion } from 'src/entities/transaction.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order) private orderRepository: Repository<Order>,
        @InjectRepository(OrderDetail) private orderDetailRepository: Repository<OrderDetail>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Product) private productRepository: Repository<Product>,
        @InjectRepository(Transaccion) private transactionRepository: Repository<Transaccion>,
        private readonly orderQuery: OrderQuery,
        private readonly dataSource: DataSource
    ){}

    async getOrders(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const orders = await this.orderQuery.getOrders(skip, limit);
        return orders;
    }

    async getOrderById(id: string) {
        const foundOrder = await this.orderQuery.getOrderById(id);
        if(!foundOrder) throw new NotFoundException(`Orden no encontrada. ID: ${id}`);        
        return foundOrder;
    }

    async getOrdersByUserId(id: string, page: number, limit: number) {
        const skip = (page - 1) * limit;
        const orders = await this.orderQuery.getOrdersByUserId(id, skip, limit);
        return orders;
    }

    async createOrder(userId: string, productsInfo: ProductInfo[], address: string | undefined, account: boolean) {
        let total = 0; 
        let createdOrder;
  
        const user = await this.userRepository.findOneBy({ id: userId, isDeleted: false });   
        if (!user) throw new BadRequestException(`Usuario no encontrado. ID: ${userId}`);
    
        await Promise.all(productsInfo.map(async (product)=> {
            const foundProduct = await this.productRepository.findOneBy({ id: product.id });
            if (!foundProduct) throw new BadRequestException(`Producto no encontrado. ID: ${product.id}`);
            if (foundProduct.stock <= 0) throw new BadRequestException(`Producto sin stock. ID: ${foundProduct.id}`);
        }));
  
        await this.dataSource.transaction(async (transactionalEntityManager) => {
            const order = transactionalEntityManager.create(Order, { user, date: new Date() });
            const newOrder = await transactionalEntityManager.save(order);
            createdOrder = newOrder;
    
            await Promise.all(productsInfo.map(async (product) => {
                await this.updateStock(product.id);
    
                const foundProduct = await transactionalEntityManager.findOneBy(Product, { id: product.id });
                if (!foundProduct) throw new BadRequestException(`Product not found. ID: ${product.id}`);
                
                total += ((foundProduct.price * product.quantity) * (1 - foundProduct.discount));
                
                const productsOrder = transactionalEntityManager.create(ProductsOrder, {
                    product: foundProduct, 
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
  
        
        await this.orderDetailRepository.update(
            { id: order.orderDetail.id }, 
            { deliveryDate: data.deliveryDate}
        );

        await this.transactionRepository.update({ id: order.orderDetail.transactions.id }, { status: data.status });

        return { HttpCode: 200 };
    }

    async MercadoPagoUpdate(id: string) {
        const foundOrder = await this.orderRepository.findOne(
            { where: { id }, 
            relations: { orderDetail: { transactions: true } } 
        });
        if (!foundOrder) throw new BadRequestException(`Orden no encontrada. ID: ${id}`);

        await this.orderRepository.update(id, { status: 'Pagado' });
        await this.transactionRepository.update({ id: foundOrder.orderDetail.transactions.id }, { status: 'En preparación' });

        return { HttpCode: 200 };
    }
  
    async deleteOrder(id: string) {
        const foundOrder = await this.orderQuery.getOrderById(id);
        if(!foundOrder) throw new NotFoundException(`Orden no encontrada. ID: ${id}`);   
      
        return await this.orderQuery.deleteOrder(id);
    }
    
    async updateStock(id: string) {
        const product = await this.productRepository.findOne({ where: { id } });
        await this.productRepository.update({ id },{ stock: product.stock - 1 });
    }
}

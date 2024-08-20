import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { OrderDetail } from 'src/entities/orderdetail.entity';
import { DataSource, Repository } from 'typeorm';
import { ProductInfo } from './order.dto';
import { User } from 'src/entities/user.entity';
import { Product } from 'src/entities/products/product.entity';
import { ProductsOrder } from 'src/entities/product-order.entity';
import { OrderQuery } from './orders.query';
import { Transaccion } from 'src/entities/transaction.entity';
import { OrderStatus } from 'src/enum/orderStatus.enum';


@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order) private orderRepository: Repository<Order>,
        @InjectRepository(OrderDetail) private orderDetailRepository: Repository<OrderDetail>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Product) private productRepository: Repository<Product>,
        private readonly orderQuery: OrderQuery,
        private readonly dataSource: DataSource
    ){}

    async getOrders() {
        return await this.orderQuery.getOrders()
    }

    async getOrderById(id: string) {
        const foundOrder = await this.orderQuery.getOrderById(id);
        if(!foundOrder) throw new NotFoundException(`Orden no encontrada. ID: ${id}`);

        return foundOrder;
    }

    async getOrdersByUserId(id: string) {
        return await this.orderQuery.getOrdersByUserId(id)
    }

    async createOrder(userId: string, productsInfo: ProductInfo[], address: undefined | string, discount: undefined | number, deliveryDate: undefined | Date) {
        let total = 0 ; 
        let createdOrder;

        const user = await this.userRepository.findOneBy({ id: userId, isDeleted: false });   
    
        // Verifica existencia de productos y stock
        await Promise.all(productsInfo.map(async (product)=> {
            const foundProduct = await this.productRepository.findOneBy({ id: product.id });
            if(foundProduct.stock <= 0) throw new BadRequestException(`Producto sin stock. ID: ${foundProduct.id}`);
            
            return true;
        }));

        // Iniciamos transaccion
        
        await this.dataSource.transaction(async (transactionalEntityManager)=>{

            const order = transactionalEntityManager.create(Order, { user, date: new Date() });
            const newOrder = await transactionalEntityManager.save(order)
            createdOrder = newOrder;

            await Promise.all(
                productsInfo.map(async (product) => {
                    this.updateStock(product.id);

                    const foundProduct = await transactionalEntityManager.findOneBy(Product, { id: product.id });
                    total += ((foundProduct.price * product.quantity) * (1 - foundProduct.discount));
                    
                    // Lo guardamos en la orden
                    const productsOrder = transactionalEntityManager.create(ProductsOrder,{
                        foundProduct,
                        order,
                        quantity: product.quantity
                    });

                    await transactionalEntityManager.save(ProductsOrder, productsOrder);
                    }
                ));
            
            if(discount) total *= (1 - discount);
               const orderDetail = transactionalEntityManager.create(OrderDetail, {
                totalPrice: Number(total.toFixed(2)),
                order: newOrder,
                discount: discount || 0,
                addressDelivery: address || 'Tienda',
                deliveryDate
            });
                    
            await transactionalEntityManager.save(OrderDetail, orderDetail);

            // Agregamos estado

            await transactionalEntityManager.save(Transaccion, {
                status: OrderStatus.RECIBIDO,
                timestamp: new Date(),
                orderdetail: orderDetail
            });
        })

        return createdOrder;
    }

    async deleteOrder(id: string) {
      return await this.orderQuery.deleteOrder(id);
    }
    
    async updateStock(id: string) {
        const product = await this.productRepository.findOne({ where: { id } });
        await this.productRepository.update({ id },{ stock: product.stock - 1 });

        }
}

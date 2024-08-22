import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "src/entities/order.entity";
import { ProductsOrder } from "src/entities/product-order.entity";
import { Repository } from "typeorm";
import { Product } from "src/entities/products/product.entity";
@Injectable()
export class OrderQuery {

    constructor(
        @InjectRepository(Order) private orderRepository: Repository<Order>,
        @InjectRepository(ProductsOrder) private productsOrderRepository: Repository<ProductsOrder>,
        @InjectRepository(Product) private productRepository: Repository<Product>
    ) {}

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
    
        return order;
    }
    
    async getOrdersByUserId(id: string) {
        const orders = await this.orderRepository
            .createQueryBuilder('orders')
            .leftJoinAndSelect('orders.user', 'user')
            .leftJoinAndSelect('orders.productsOrder', 'productsOrder') 
            .leftJoinAndSelect('productsOrder.product', 'products')
            .leftJoinAndSelect('orders.orderDetail', 'orderDetails')
            .leftJoinAndSelect('orderDetails.transactions', 'transaction')
            .where('user.id = :orID', { orID: id })
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
            .getMany();
    
        return orders;
    }
    
    async getOrders() {
        const orders = await this.orderRepository
            .createQueryBuilder('orders')
            .leftJoinAndSelect('orders.user', 'user')
            .leftJoinAndSelect('orders.productsOrder', 'productsOrder') 
            .leftJoinAndSelect('productsOrder.product', 'products')
            .leftJoinAndSelect('orders.orderDetail', 'orderDetails')
            .leftJoinAndSelect('orderDetails.transactions', 'transaction')
            .where('orders.isDeleted = :isDeleted', { isDeleted: false })
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
    
        return orders;
    }

    
  
    
    async deleteOrder(id: string) {
        const foundOrder = await this.orderRepository.findOneBy({ id });
        if(!foundOrder) throw new NotFoundException(`Orden no encontrada. ID: ${id}`);
        
        await this.orderRepository.update(id, {isDeleted:true});

        return foundOrder;
    }
    
}

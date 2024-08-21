import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "src/entities/order.entity";
import { ProductsOrder } from "src/entities/product-order.entity";
import { Repository } from "typeorm";
import {  OrderResponseDto, UpdateOrderDto } from "./order.dto";
import { Product } from "src/entities/products/product.entity";
import { OrderDetail } from "src/entities/orderdetail.entity";
import { plainToInstance } from "class-transformer";
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
                'products.id',
                'products.description',
                'products.price',
                'products.discount',
                'products.imgUrl',
            ])
            .getMany();
    
        return orders;
    }


    async updateOrder(orderId: string, updateOrderDto: UpdateOrderDto): Promise<OrderResponseDto> {
        const order = await this.orderRepository.findOne({
            where: { id: orderId, isDeleted: false },
            relations: ['productsOrder', 'productsOrder.product', 'orderDetail'],
        });
    
        if (!order) {
            throw new Error(`Order with ID ${orderId} not found`);
        }
    
        if (updateOrderDto.address) {
            order.orderDetail.addressDelivery = updateOrderDto.address;
        }
    
        if (updateOrderDto.discount) {
            order.orderDetail.cupoDescuento = updateOrderDto.discount;
        }
    
        if (updateOrderDto.deliveryDate) {
            order.orderDetail.deliveryDate = updateOrderDto.deliveryDate;
        }
    
        if (updateOrderDto.products) {
            order.productsOrder = [];
    
            for (const productDto of updateOrderDto.products) {
                const productOrder = new ProductsOrder();
                productOrder.quantity = productDto.quantity;
    
                const product = await this.productRepository.findOne({ where: { id: productDto.id } });
    
                if (!product) {
                    throw new Error(`Product with ID ${productDto.id} not found`);
                }
    
                productOrder.product = product;
                productOrder.order = order;
    
                await this.productsOrderRepository.save(productOrder);
                order.productsOrder.push(productOrder);
            }
        }
    
        await this.orderRepository.save(order);
    
        return plainToInstance(OrderResponseDto, {
            ...order,
            productsOrder: order.productsOrder.map(po => ({
                id: po.id,
                quantity: po.quantity,
                productId: po.product.id,
            })),
        });
    }
    
    
    async deleteOrder(id: string) {
        const foundOrder = await this.orderRepository.findOneBy({ id });
        if(!foundOrder) throw new NotFoundException(`Orden no encontrada. ID: ${id}`);
        
        await this.orderRepository.update(id, {isDeleted:true});

        return foundOrder;
    }
    
}

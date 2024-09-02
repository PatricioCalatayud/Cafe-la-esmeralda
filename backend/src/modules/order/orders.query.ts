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
          .leftJoinAndSelect('productsOrder.subproduct', 'subproduct')
          .leftJoinAndSelect('subproduct.product', 'product')
          .leftJoinAndSelect('orders.orderDetail', 'orderDetails')
          .leftJoinAndSelect('orderDetails.transactions', 'transaction')
          .leftJoinAndSelect('orders.receipt', 'receipt')
          .where('orders.id = :orID', { orID: id })
          .andWhere('orders.isDeleted = :isDeleted', { isDeleted: false })
          .select([
              'user.id',
              'user.name',
              'user.email',
              'orders.id',
              'orders.date',
              'orders.orderStatus',
              'orderDetails.totalPrice',
              'orderDetails.deliveryDate',
              'orderDetails.addressDelivery',
              'transaction.status',
              'transaction.timestamp',
              'productsOrder.quantity',
              'product.description',
              'product.imgUrl',
              'subproduct.id',
              'subproduct.price',
              'subproduct.discount',
              'subproduct.amount',
              'subproduct.unit',
              'receipt'
          ])
          .getOne();
  
      return order;
  }

  async getOrdersByUserId(id: string, page: number = 1, limit: number = 10): Promise<{ data: Order[], total: number }> {
    const skip = (page - 1) * limit;

    const [orders, total] = await this.orderRepository
        .createQueryBuilder('orders')
        .leftJoinAndSelect('orders.user', 'user')
        .leftJoinAndSelect('orders.productsOrder', 'productsOrder')
        .leftJoinAndSelect('productsOrder.subproduct', 'subproduct')
        .leftJoinAndSelect('subproduct.product', 'product')
        .leftJoinAndSelect('orders.orderDetail', 'orderDetails')
        .leftJoinAndSelect('orderDetails.transactions', 'transaction')
        .where('user.id = :userId', { userId: id })
        .andWhere('orders.isDeleted = :isDeleted', { isDeleted: false })
        .skip(skip)
        .take(limit)
        .getManyAndCount();

    return { data: orders, total };
  }
      
  async getOrders(page: number, limit: number) {
    const skip = (page - 1) * limit;
  
    const orders = await this.orderRepository
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
        'user.role',
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
}
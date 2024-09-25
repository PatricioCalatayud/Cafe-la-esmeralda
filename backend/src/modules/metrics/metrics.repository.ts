import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/entities/account.entity';
import { Order } from 'src/entities/order.entity';
import { OrderDetail } from 'src/entities/orderdetail.entity';
import { ProductsOrder } from 'src/entities/product-order.entity';
import { Product } from 'src/entities/products/product.entity';
import { User } from 'src/entities/user.entity';
import { Between, Repository } from 'typeorm';

@Injectable()
export class OrdersMetricsRepository {
  constructor(
    @InjectRepository(ProductsOrder) private readonly productsOrderRepository: Repository<ProductsOrder>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(Account) private readonly accountRepository: Repository<Account>,
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

    async getMostSoldProductsRepository(limit: number) {
      const products = await this.productsOrderRepository
        .createQueryBuilder('productsOrder')
        .select('"subproductId"', 'subproductId')
        .addSelect('SUM(quantity)', 'quantity')
        .addSelect('product.id', 'productId')  
        .innerJoin('productsOrder.subproduct', 'subproduct')  
        .innerJoin('subproduct.product', 'product')  
        .groupBy('"subproductId"')
        .addGroupBy('product.id') 
        .orderBy('quantity', 'DESC')
        .limit(limit)
        .getRawMany();
    
      return products;
    }
    async getLessSoldProductsRepository(limit: number) {
      const products = await this.productsOrderRepository
        .createQueryBuilder('productsOrder')
        .select('"subproductId"', 'subproductId')
        .addSelect('SUM(quantity)', 'quantity')
        .addSelect('product.id', 'productId')  
        .innerJoin('productsOrder.subproduct', 'subproduct')  
        .innerJoin('subproduct.product', 'product')  
        .groupBy('"subproductId"')
        .addGroupBy('product.id') 
        .orderBy('quantity', 'ASC')
        .limit(limit)
        .getRawMany();
    
      return products;
    }
    
    async getBestProductsRepository(limit:number) {
      const products = await this.productRepository
        .createQueryBuilder('productRating')
        .select('id', 'id')
        .addSelect('description', 'description')
        .addSelect('"averageRating"', 'averageRating')
        .orderBy('"averageRating"', 'DESC')
        .limit(limit)
        .getRawMany();
      return products;
    }
    async getWorstProductsRepository(limit:number) {
      const products = await this.productRepository
        .createQueryBuilder('productRating')
        .select('id', 'id')
        .addSelect('description', 'description')
        .addSelect('"averageRating"', 'averageRating')
        .orderBy('"averageRating"', 'ASC')
        .limit(limit)
        .getRawMany();
      return products;
    }
    async getLargestDebtorsRepository(limit: number) {
      const debtors = await this.accountRepository
        .createQueryBuilder('account')
        .select('user.id', 'userId')
        .addSelect('user.name', 'userName')
        .addSelect('SUM(account.balance)', 'balance')
        .innerJoin('account.user', 'user')
        .where('user.role = :role', { role: 'Cliente' }) 
        .groupBy('user.id, user.name')
        .orderBy('balance', 'DESC')
        .limit(limit)
        .getRawMany();
    
      return debtors;
    }

    async getOrdersByUserIdAndDateRepository(id: string, date: Date): Promise<{ data: Order[], total: number }> {
      const user = await this.userRepository.findOne({
          where: { id },
      });

      if (!user) throw new NotFoundException(`Usuario no encontrado. ID: ${id}`);

      const year = date.getFullYear();
      const month = date.getMonth()+2; 
      

      const queryBuilder = this.orderRepository.createQueryBuilder('order')
          .leftJoinAndSelect('order.productsOrder', 'productsOrder')
          .leftJoinAndSelect('productsOrder.subproduct', 'subproduct')
          .leftJoinAndSelect('subproduct.product', 'product')
          .leftJoinAndSelect('order.orderDetail', 'orderDetail')
          .leftJoinAndSelect('orderDetail.transactions', 'transactions')
          .leftJoinAndSelect('order.receipt', 'receipt')
          .leftJoinAndSelect('order.bill', 'bill')
          .where('order.userId = :userId', { userId: user.id })
          .andWhere('EXTRACT(YEAR FROM order.date) = :year', { year })
          .andWhere('EXTRACT(MONTH FROM order.date) = :month', { month });

      const [data, total] = await queryBuilder.getManyAndCount();

      return { data, total };
  }

  async getProductsByMonthRepository(dateSelected, productId, limit) {  
    const year = dateSelected.getFullYear();
    const month = dateSelected.getMonth() + 2;
    
    const queryBuilder = this.productsOrderRepository
      .createQueryBuilder('productsOrder')
      .leftJoinAndSelect('productsOrder.subproduct', 'subproduct')
      .leftJoinAndSelect('subproduct.product', 'product')
      .leftJoinAndSelect('productsOrder.order', 'order')
      .leftJoinAndSelect('order.user', 'user')
      .where('product.id = :productId', { productId })
      .andWhere('EXTRACT(YEAR FROM order.date) = :year', { year })
      .andWhere('EXTRACT(MONTH FROM order.date) = :month', { month })
      .orderBy('productsOrder.quantity', 'DESC')
      .limit(limit);
  
    try {
      const results = await queryBuilder.getMany();
      return results;
    } catch (error) {
      console.error('Error executing query: ', error);
      throw new Error('Error al obtener productos por mes.');
    }
  }
  

  async geAllTimeProductsRepository( productId, limit) {  

    const queryBuilder = this.productsOrderRepository
      .createQueryBuilder('productsOrder')
      .leftJoinAndSelect('productsOrder.subproduct', 'subproduct')
      .leftJoinAndSelect('subproduct.product', 'product')
      .leftJoinAndSelect('productsOrder.order', 'order')
      .leftJoinAndSelect('order.user', 'user')
      .where('product.id = :productId', { productId })
      .orderBy('productsOrder.quantity', 'DESC')
      .limit(limit);
  
    try {
      const results = await queryBuilder.getMany();
      return results;
    } catch (error) {
      console.error('Error executing query: ', error);
      throw new Error('Error al obtener productos por mes.');
    }
  }

}
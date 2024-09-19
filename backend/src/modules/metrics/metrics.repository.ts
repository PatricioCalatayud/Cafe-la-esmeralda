import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetail } from 'src/entities/orderdetail.entity';
import { ProductsOrder } from 'src/entities/product-order.entity';
import { Product } from 'src/entities/products/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersMetricsRepository {
  constructor(
    @InjectRepository(ProductsOrder) private readonly productsOrderRepository: Repository<ProductsOrder>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
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
}
import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { OrdersMetricsService } from './metrics.service';
import { OrdersMetricsRepository } from './metrics.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsOrder } from 'src/entities/product-order.entity';
import { Product } from 'src/entities/products/product.entity';


@Module({
  imports: [TypeOrmModule.forFeature([ProductsOrder, Product])],
  controllers: [MetricsController],
  providers: [OrdersMetricsService, OrdersMetricsRepository ]
})
export class MetricsModule {}
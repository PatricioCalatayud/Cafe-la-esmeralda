import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/products/product.entity';
import { Order } from 'src/entities/order.entity';
import { User } from 'src/entities/user.entity';
import { OrderDetail } from 'src/entities/orderdetail.entity';
import { ProductsOrder } from 'src/entities/product-order.entity';
import { Transaccion } from 'src/entities/transaction.entity';
import { Subproduct } from 'src/entities/products/subprodcut.entity';
import { OrderQuery } from './orders.query';

@Module({
  imports: [TypeOrmModule.forFeature([Product,Order,User,OrderDetail,ProductsOrder,Transaccion, Subproduct])],
  providers: [OrderService, OrderQuery],
  controllers: [OrderController],
  exports:[OrderService]
})
export class OrderModule {}

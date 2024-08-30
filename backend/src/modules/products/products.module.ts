import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/products/product.entity';
import { Category } from 'src/entities/category.entity';
import { Subproduct } from 'src/entities/products/subproduct.entity';
import { ImageModule } from '../images/image.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product,Category, Subproduct]), ImageModule],
  providers: [ProductsService],
  controllers: [ProductsController]
})
export class ProductsModule {}
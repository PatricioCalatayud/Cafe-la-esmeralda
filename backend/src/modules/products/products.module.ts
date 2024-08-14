import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/products/product.entity';
import { Category } from 'src/entities/category.entity';
import { ImageService } from './image.service';
import { Coffee } from 'src/entities/products/product-coffee.entity';
import { Subproduct } from 'src/entities/products/subprodcut.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product,Category,Coffee, Subproduct])],
  providers: [ProductsService, ImageService],
  controllers: [ProductsController]
})
export class ProductsModule {}

import { Module } from '@nestjs/common';
import { ProductRatingService } from './product-rating.service';
import { ProductRatingController } from './product-rating.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from 'src/entities/ratings.entity';
import { Product } from 'src/entities/products/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rating, Product])],
  providers: [ProductRatingService],
  controllers: [ProductRatingController]
})
export class ProductRatingModule {}

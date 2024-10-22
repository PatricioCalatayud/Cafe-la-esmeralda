import { Module } from '@nestjs/common';
import { CsvController } from './csv.controller';
import { CsvService } from './csv.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/products/product.entity';
import { Subproduct } from 'src/entities/products/subproduct.entity';
import { CsvRepository } from './csv.repository';
import { Category } from 'src/entities/category.entity';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [ HttpModule, TypeOrmModule.forFeature([Product, Subproduct, Category])],
  controllers: [CsvController],
  providers: [CsvService, CsvRepository ],
  exports: [CsvService]
})
export class CsvModule {}

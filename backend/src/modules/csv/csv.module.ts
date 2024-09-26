import { Module } from '@nestjs/common';
import { CsvController } from './csv.controller';
import { CsvService } from './csv.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/products/product.entity';
import { Subproduct } from 'src/entities/products/subproduct.entity';
import { CsvRepository } from './csv.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Subproduct])],
  controllers: [CsvController],
  providers: [CsvService, CsvRepository],
  exports: [CsvService]
})
export class CsvModule {}

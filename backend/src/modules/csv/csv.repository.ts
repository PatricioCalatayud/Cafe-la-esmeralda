import { Injectable } from '@nestjs/common';
import { format, parse } from 'fast-csv';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/products/product.entity';
import { Subproduct } from 'src/entities/products/subproduct.entity';
import * as fs from 'fs';

@Injectable()
export class CsvRepository {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(Subproduct) private readonly subproductRepository: Repository<Subproduct>,
  ) {}

  async generateSellsCsv(): Promise<string> {
    const products = await this.productRepository.find({
      relations: ['subproducts'],
    });

    const csvFilePath = './cafeteria_products.csv';
    const writeStream = fs.createWriteStream(csvFilePath);
    const csvStream = format({ headers: true });

    csvStream.pipe(writeStream);

    products.forEach(product => {
      product.subproducts.forEach(subproduct => {
        csvStream.write({
          ProductDescription: product.description,
          Presentacion: product.presentacion,
          TipoGrano: product.tipoGrano,
          SubproductAmount: subproduct.amount,
          Unit: subproduct.unit,
          Stock: subproduct.stock,
          Price: subproduct.price,
          Discount: subproduct.discount,
          IsAvailable: subproduct.isAvailable ? 'Yes' : 'No',
        });
      });
    });

    csvStream.end();

    return csvFilePath;
  }


  async processCsvRepository(filePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const results = [];
      console.log(results)

      fs.createReadStream(filePath)
        .pipe(parse({ headers: true }))
        .on('data', (row) => {
          results.push(row);
        })
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
}







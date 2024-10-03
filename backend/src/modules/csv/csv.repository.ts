import { Injectable } from '@nestjs/common';
import { format, parse } from 'fast-csv';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/products/product.entity';
import { Subproduct } from 'src/entities/products/subproduct.entity';
import * as fs from 'fs';
import { Category } from 'src/entities/category.entity';

@Injectable()
export class CsvRepository {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(Subproduct) private readonly subproductRepository: Repository<Subproduct>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
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

  async updateProductsFromCsvRepository(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const fileStream = fs.createReadStream(filePath);

      fileStream
        .pipe(parse({ headers: true }))
        .on('data', async (row) => {
          // Manejo manual de líneas vacías
          if (Object.values(row).every(value => value === '')) {
            return; // Ignora filas vacías
          }
          const {category, ...rowWithoutCategory} = row;

          const categoryEntity = await this.categoryRepository.findOne({ where: { name: category } });

          if (!categoryEntity) {
            throw new Error(`Category "${category}" not found.`);
          }
          const {
            description,
            imgUrl,
            presentacion,
            tipoGrano,
            subproduct_price,
            subproduct_stock,
            subproduct_amount,
            subproduct_unit,
          } = row;

          // Busca el producto en la base de datos
          let product = await this.productRepository.findOne({ where: { description } });

          if (!product) {
            // Si no existe, crearlo
            product = this.productRepository.create({
              description,
              imgUrl,
              category: categoryEntity,
              presentacion: presentacion || null,
              tipoGrano: tipoGrano || null,
            });
            await this.productRepository.save(product);
          }

          // Crear o actualizar subproducto
          const subproduct = this.subproductRepository.create({
            price: subproduct_price,
            stock: subproduct_stock,
            amount: subproduct_amount,
            unit: subproduct_unit,
            product: product,
          });

          await this.subproductRepository.save(subproduct);
        })
        .on('end', () => {
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
}







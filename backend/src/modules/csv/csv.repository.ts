import { Injectable } from '@nestjs/common';
import { format, parse } from 'fast-csv';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/products/product.entity';
import { Subproduct } from 'src/entities/products/subproduct.entity';
import { Response } from 'express';
import * as fs from 'fs';
import * as fastcsv from 'fast-csv';
import { Category } from 'src/entities/category.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { join } from 'path';

@Injectable()
export class CsvRepository {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(Subproduct) private readonly subproductRepository: Repository<Subproduct>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    private readonly httpService: HttpService
  ) {}
  async getAllTimeProductsRepository(productId: string, limit: number, res: Response): Promise<void> {
    const metricsDto = { productId, limit };
    const url = 'http://localhost:3001/metrics/productos-vendidos';

    try {
        const response = await firstValueFrom(this.httpService.post(url, metricsDto));
        console.log('Datos recibidos:', JSON.stringify(response.data, null, 2));

        if (!response.data || response.data.length === 0) {
            throw new Error('No se recibieron productos de la métrica');
        }

        // Transformar los datos al formato deseado
        const csvRows = response.data.map(item => {
            const product = item.subproduct.product;
            const subproduct = item.subproduct;
            const order = item.order;

            return {
                OrderId: order.id,
                OrderDate: new Date(order.date).toLocaleDateString(),
                OrderStatus: order.orderStatus ? 'Completado' : 'Pendiente',
                ProductId: product.id,
                ProductDescription: product.description || 'N/A',
                Presentacion: product.presentacion || 'N/A',
                TipoGrano: product.tipoGrano || 'N/A',
                SubproductAmount: subproduct.amount || '0',
                Unit: subproduct.unit || 'N/A',
                Stock: subproduct.stock || '0',
                Price: subproduct.price || '0',
                Discount: subproduct.discount || '0',
                IsAvailable: subproduct.isAvailable ? 'Yes' : 'No',
                Quantity: item.quantity,
                Total: (subproduct.price * item.quantity),
                CustomerName: order.user.name,
                CustomerEmail: order.user.email,
                CustomerPhone: order.user.phone
            };
        });

        console.log('Filas procesadas:', csvRows.length);
        console.log('Primera fila de ejemplo:', csvRows[0]);

        // Guardar en archivo local
        const timestamp = new Date().getTime();
        const localFilePath = join(process.cwd(), 'temp', `metrics_products_${timestamp}.csv`);

        // Asegurar que el directorio temp existe
        if (!fs.existsSync(join(process.cwd(), 'temp'))) {
            fs.mkdirSync(join(process.cwd(), 'temp'));
        }

        await new Promise<void>((resolve, reject) => {
            const writeStream = fs.createWriteStream(localFilePath);
            const csvStream = fastcsv.format({ 
                headers: true,
                delimiter: ',',
                quote: '"'
            });

            writeStream.on('error', (error) => {
                console.error('Error escribiendo archivo:', error);
                reject(error);
            });

            writeStream.on('finish', () => {
                console.log('Archivo CSV escrito correctamente');
                resolve();
            });

            csvStream.pipe(writeStream);

            // Escribir los datos
            csvRows.forEach(row => csvStream.write(row));

            csvStream.end();
        });

        const fileContent = fs.readFileSync(localFilePath, 'utf-8');
        
        res.status(200).json({
            message: 'CSV generado correctamente',
            localFilePath,
            csvContent: fileContent,
            rowCount: csvRows.length,
            firstRow: csvRows[0]
        });

    } catch (error) {
        console.error('Error completo:', error);
        res.status(500).json({
            error: 'No se pudo obtener la información de productos',
            details: error.message,
            stack: error.stack
        });
    }
}

  
  async generateSellsCsv(): Promise<string> {
    const products = await this.productRepository.find({ relations: ['subproducts'] });

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
          if (Object.values(row).every(value => value === '')) {
            return;
          }

          const { category, ...rowWithoutCategory } = row;
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

          let product = await this.productRepository.findOne({ where: { description } });

          if (!product) {
            product = this.productRepository.create({
              description,
              imgUrl,
              category: categoryEntity,
              presentacion: presentacion || null,
              tipoGrano: tipoGrano || null,
            });
            await this.productRepository.save(product);
          }

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

    async bestAverageRatingRepository(limit: number, res: Response): Promise<void> {
      const metricsDto = { limit };
      const url = 'http://localhost:3001/metrics/mejores-productos'; // Tu URL para obtener los mejores productos
  
      try {
        const response = await firstValueFrom(this.httpService.post(url, metricsDto));
        console.log('Datos recibidos:', JSON.stringify(response.data, null, 2));
  
        if (!response.data || response.data.length === 0) {
          throw new Error('No se recibieron productos de la métrica');
        }
  
        const csvRows = response.data.map(item => {
          return {
            ProductId: item.id, 
            ProductDescription: item.description,
            AverageRating: item.averageRating   
          };
        });
  
        console.log('Filas procesadas:', csvRows.length);
        console.log('Primera fila de ejemplo:', csvRows[0]);
  
        const timestamp = new Date().getTime();
        const localFilePath = join(process.cwd(), 'temp', `best_products_${timestamp}.csv`);
  
        if (!fs.existsSync(join(process.cwd(), 'temp'))) {
          fs.mkdirSync(join(process.cwd(), 'temp'));
        }
  
        await new Promise<void>((resolve, reject) => {
          const writeStream = fs.createWriteStream(localFilePath);
          const csvStream = fastcsv.format({
            headers: true,
            delimiter: ',',
            quote: '"'
          });
  
          writeStream.on('error', (error) => {
            console.error('Error escribiendo archivo:', error);
            reject(error);
          });
  
          writeStream.on('finish', () => {
            console.log('Archivo CSV escrito correctamente');
            resolve();
          });
  
          csvStream.pipe(writeStream);
  
          csvRows.forEach(row => csvStream.write(row));
  
          csvStream.end();
        });
  
        const fileContent = fs.readFileSync(localFilePath, 'utf-8');
  
        res.status(200).json({
          message: 'CSV generado correctamente',
          localFilePath,
          csvContent: fileContent,
          rowCount: csvRows.length,
          firstRow: csvRows[0]
        });
  
      } catch (error) {
        console.error('Error completo:', error);
        res.status(500).json({
          error: 'No se pudo obtener la información de productos',
          details: error.message,
          stack: error.stack
      });
    }
  }

  async worstAverageRatingRepository(limit: number, res: Response): Promise<void> {
    const metricsDto = { limit };
    const url = 'http://localhost:3001/metrics/peores-productos'; 

    try {
      const response = await firstValueFrom(this.httpService.post(url, metricsDto));
      console.log('Datos recibidos:', JSON.stringify(response.data, null, 2));

      if (!response.data || response.data.length === 0) {
        throw new Error('No se recibieron productos de la métrica');
      }

      const csvRows = response.data.map(item => {
        return {
          ProductId: item.id, 
          ProductDescription: item.description, 
          AverageRating: item.averageRating 
        };
      });

      console.log('Filas procesadas:', csvRows.length);
      console.log('Primera fila de ejemplo:', csvRows[0]);

      const timestamp = new Date().getTime();
      const localFilePath = join(process.cwd(), 'temp', `best_products_${timestamp}.csv`);

      if (!fs.existsSync(join(process.cwd(), 'temp'))) {
        fs.mkdirSync(join(process.cwd(), 'temp'));
      }

      await new Promise<void>((resolve, reject) => {
        const writeStream = fs.createWriteStream(localFilePath);
        const csvStream = fastcsv.format({
          headers: true,
          delimiter: ',',
          quote: '"'
        });

        writeStream.on('error', (error) => {
          console.error('Error escribiendo archivo:', error);
          reject(error);
        });

        writeStream.on('finish', () => {
          console.log('Archivo CSV escrito correctamente');
          resolve();
        });

        csvStream.pipe(writeStream);

        csvRows.forEach(row => csvStream.write(row));

        csvStream.end();
      });

      const fileContent = fs.readFileSync(localFilePath, 'utf-8');

      res.status(200).json({
        message: 'CSV generado correctamente',
        localFilePath,
        csvContent: fileContent,
        rowCount: csvRows.length,
        firstRow: csvRows[0]
      });

    } catch (error) {
      console.error('Error completo:', error);
      res.status(500).json({
        error: 'No se pudo obtener la información de productos',
        details: error.message,
        stack: error.stack
    });
  }
}
  async debtorsRepository(limit: number, res: Response): Promise<void> {
    const metricsDto = { limit };
    const url = 'http://localhost:3001/metrics/deudores'; 

    try {
      const response = await firstValueFrom(this.httpService.post(url, metricsDto));
      console.log('Datos recibidos:', JSON.stringify(response.data, null, 2));

      if (!response.data || response.data.length === 0) {
        throw new Error('No se recibieron productos de la métrica');
      }

      const csvRows = response.data.map(item => {
        return {
          ProductId: item.id, 
          ProductDescription: item.description, 
          AverageRating: item.averageRating 
        };
      });

      console.log('Filas procesadas:', csvRows.length);
      console.log('Primera fila de ejemplo:', csvRows[0]);

      const timestamp = new Date().getTime();
      const localFilePath = join(process.cwd(), 'temp', `best_products_${timestamp}.csv`);

      if (!fs.existsSync(join(process.cwd(), 'temp'))) {
        fs.mkdirSync(join(process.cwd(), 'temp'));
      }

      await new Promise<void>((resolve, reject) => {
        const writeStream = fs.createWriteStream(localFilePath);
        const csvStream = fastcsv.format({
          headers: true,
          delimiter: ',',
          quote: '"'
        });

        writeStream.on('error', (error) => {
          console.error('Error escribiendo archivo:', error);
          reject(error);
        });

        writeStream.on('finish', () => {
          console.log('Archivo CSV escrito correctamente');
          resolve();
        });

        csvStream.pipe(writeStream);

        csvRows.forEach(row => csvStream.write(row));

        csvStream.end();
      });

      const fileContent = fs.readFileSync(localFilePath, 'utf-8');

      res.status(200).json({
        message: 'CSV generado correctamente',
        localFilePath,
        csvContent: fileContent,
        rowCount: csvRows.length,
        firstRow: csvRows[0]
      });

    } catch (error) {
      console.error('Error completo:', error);
      res.status(500).json({
        error: 'No se pudo obtener la información de productos',
        details: error.message,
        stack: error.stack
    });
  }
}
  
}

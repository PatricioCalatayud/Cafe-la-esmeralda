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
import { parse as csvParse } from 'csv-parse/sync';


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
                delimiter: ';',
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
            delimiter: ';',
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
          delimiter: ';',
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
          delimiter: ';',
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

async productsByDeliveryRepository(deliveryNumber: number, date: string, limit: number, res: Response): Promise<void> {
  const metricsDto = { deliveryNumber, date, limit };
  const url = 'http://localhost:3001/metrics/productos-por-reparto-por-mes';

  try {
      // Realiza el POST a la nueva URL
      const response = await firstValueFrom(this.httpService.post(url, metricsDto));
      console.log('Datos recibidos:', JSON.stringify(response.data, null, 2));

      if (!response.data || response.data.length === 0) {
          throw new Error('No se recibieron productos del reparto');
      }

      const csvRows = response.data.map(item => {
          return {
              ProductId: item.product_id,
              ProductDescription: item.product_description,
              ProductPrice: item.subproduct_price,
              OrderId: item.order_id,
              OrderDate: item.order_date,
              UserName: item.user_name,
              UserEmail: item.user_email,
              UserPhone: item.user_phone,
              DeliveryNumber: item.address_deliveryNumber,
              Address: item.address_address
          };
      });

      console.log('Filas procesadas:', csvRows.length);
      console.log('Primera fila de ejemplo:', csvRows[0]);

      const timestamp = new Date().getTime();
      const localFilePath = join(process.cwd(), 'temp', `delivery_products_${timestamp}.csv`);

      if (!fs.existsSync(join(process.cwd(), 'temp'))) {
          fs.mkdirSync(join(process.cwd(), 'temp'));
      }

      await new Promise<void>((resolve, reject) => {
          const writeStream = fs.createWriteStream(localFilePath);
          const csvStream = fastcsv.format({
              headers: true,
              delimiter: ';',
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
          error: 'No se pudo obtener la información de productos por reparto',
          details: error.message,
          stack: error.stack
      });
  }
}


async getProductsByUserMonthByMonthRepository(userId: string, date: string, limit: number, res: Response): Promise<void> {
  const metricsDto = { userId, date, limit };
  const url = 'http://localhost:3001/metrics/productos-mes-por-mes-usuario';

  try {
      const response = await firstValueFrom(this.httpService.post(url, metricsDto));
      console.log('Datos recibidos:', JSON.stringify(response.data, null, 2));

      // Validación adicional
      if (!response.data || response.data.length === 0) {
          throw new Error('No se recibieron productos para el usuario');
      }

      const csvRows = [];
      response.data.forEach((monthData: any) => {
          // Validación para monthData.items
          if (Array.isArray(monthData.items) && monthData.items.length > 0) {
              monthData.items.forEach((item: any) => {
                  csvRows.push({
                      Month: monthData.month,
                      ProductId: item.product_id,
                      ProductDescription: item.product_description,
                      Price: item.subproduct_price,
                      Amount: item.subproduct_amount,
                      Unit: item.subproduct_unit,
                      OrderId: item.order_id,
                      OrderDate: item.order_date,
                      UserName: item.user_name,
                      UserEmail: item.user_email,
                      UserPhone: item.user_phone
                  });
              });
          }
      });

      console.log('Filas procesadas:', csvRows.length);

      // Validación de filas
      if (csvRows.length === 0) {
          throw new Error('No se generaron filas para el CSV');
      }

      console.log('Primera fila de ejemplo:', csvRows[0]);

      // Ruta para guardar el archivo CSV
      const timestamp = new Date().getTime();
      const localFilePath = join(process.cwd(), 'temp', `user_products_${timestamp}.csv`);

      // Crear la carpeta 'temp' si no existe
      if (!fs.existsSync(join(process.cwd(), 'temp'))) {
          fs.mkdirSync(join(process.cwd(), 'temp'));
      }

      // Generar el archivo CSV
      await new Promise<void>((resolve, reject) => {
          const writeStream = fs.createWriteStream(localFilePath);
          const csvStream = fastcsv.format({
              headers: true,
              delimiter: ';',
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
          error: 'No se pudo obtener la información de productos por usuario',
          details: error.message,
          stack: error.stack
      });
  }
}

async getOrdersByUserByMonthRepository(userId: string, date: string, res: Response): Promise<void> {
  const metricsDto = { id: userId, date };
  const url = 'http://localhost:3001/metrics/pedidos-usuario-mes';

  try {
      const response = await firstValueFrom(this.httpService.post(url, metricsDto));
      console.log('Datos recibidos:', JSON.stringify(response.data, null, 2));

      // Accessing the correct array structure: response.data.data
      const ordersData = response.data.data;

      // Validación adicional para asegurar que el arreglo tiene pedidos
      if (!ordersData || ordersData.length === 0) {
          throw new Error('No se recibieron pedidos para el usuario en el mes especificado');
      }

      const csvRows = [];
      ordersData.forEach((orderData: any) => {
          // Validación para orderData.productsOrder
          if (Array.isArray(orderData.productsOrder) && orderData.productsOrder.length > 0) {
              orderData.productsOrder.forEach((productOrder: any) => {
                  const product = productOrder.subproduct.product;

                  csvRows.push({
                      OrderId: orderData.id,
                      OrderDate: orderData.date,
                      DeliveryDate: orderData.orderDetail.deliveryDate,
                      DeliveryAddress: orderData.orderDetail.addressDelivery,
                      TotalPrice: orderData.orderDetail.totalPrice,
                      TransactionStatus: orderData.orderDetail.transactions.status,
                      ProductId: product.id,
                      ProductDescription: product.description,
                      ProductPrice: productOrder.subproduct.price,
                      ProductAmount: productOrder.subproduct.amount,
                      ProductUnit: productOrder.subproduct.unit,
                      IsAvailable: productOrder.subproduct.isAvailable,
                      OrderStatus: orderData.orderStatus ? 'Completado' : 'Pendiente',
                      BillType: orderData.bill ? orderData.bill.type : 'N/A',
                      ReceiptStatus: orderData.receipt ? orderData.receipt.status : 'N/A'
                  });
              });
          }
      });

      console.log('Filas procesadas:', csvRows.length);

      if (csvRows.length === 0) {
          throw new Error('No se generaron filas para el CSV');
      }

      console.log('Primera fila de ejemplo:', csvRows[0]);

      const timestamp = new Date().getTime();
      const localFilePath = join(process.cwd(), 'temp', `user_orders_${timestamp}.csv`);

      if (!fs.existsSync(join(process.cwd(), 'temp'))) {
          fs.mkdirSync(join(process.cwd(), 'temp'));
      }

      await new Promise<void>((resolve, reject) => {
          const writeStream = fs.createWriteStream(localFilePath);
          const csvStream = fastcsv.format({
              headers: true,
              delimiter: ';',
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
          error: 'No se pudo obtener la información de pedidos por usuario en el mes',
          details: error.message,
          stack: error.stack
      });
  }
}


async productsBonifiedByUserByMonthRepository(userId: string, date: string, res: Response): Promise<void> {
  const metricsDto = { userId, date, limit: 10 }; // Ajusta el límite según lo necesites.
  const url = 'http://localhost:3001/metrics/productos-por-mes-usuario-bonificados';

  try {
      const response = await firstValueFrom(this.httpService.post(url, metricsDto));
      console.log('Datos recibidos:', JSON.stringify(response.data, null, 2));

      const { data } = response;
      if (!data || !data.length || !data[0].users || !data[0].users.length) {
          throw new Error('No se recibieron datos para el usuario en el mes especificado');
      }

      const monthData = data[0]; // El mes y los usuarios están en el primer objeto
      const usersData = monthData.users;

      const filteredData = usersData.map((user: any) => ({
          Month: monthData.month,
          UserId: user.userId,
          KilosFacturados: user.kilosFacturados,
          UnidadesFacturadas: user.unidadesFacturadas,
          KilosBonificados: user.kilosBonificados,
          UnidadesBonificadas: user.unidadesBonificadas,
      }));

      console.log('Filas procesadas:', filteredData.length);

      if (filteredData.length === 0) {
          throw new Error('No se generaron filas para el CSV');
      }

      console.log('Primera fila de ejemplo:', filteredData[0]);

      const timestamp = new Date().getTime();
      const localFilePath = join(process.cwd(), 'temp', `user_bonificados_facturados_${timestamp}.csv`);

      if (!fs.existsSync(join(process.cwd(), 'temp'))) {
          fs.mkdirSync(join(process.cwd(), 'temp'));
      }

      await new Promise<void>((resolve, reject) => {
          const writeStream = fs.createWriteStream(localFilePath);
          const csvStream = fastcsv.format({
              headers: true,
              delimiter: ';',
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

          filteredData.forEach(row => csvStream.write(row));

          csvStream.end();
      });

      const fileContent = fs.readFileSync(localFilePath, 'utf-8');

      res.status(200).json({
          message: 'CSV generado correctamente',
          localFilePath,
          csvContent: fileContent,
          rowCount: filteredData.length,
          firstRow: filteredData[0]
      });

  } catch (error) {
      console.error('Error completo:', error);
      res.status(500).json({
          error: 'No se pudo obtener la información de bonificados y facturados',
          details: error.message,
          stack: error.stack
      });
  }
}
async productsBonifiedAndImportByUserByMonthRepository(userId: string, date: string, res: Response): Promise<void> {
  const metricsDto = { userId, date, limit: 10 }; // Ajusta el límite según lo necesites.
  const url = 'http://localhost:3001/metrics/productos-por-mes-usuario-bonificados-importe';

  try {
      const response = await firstValueFrom(this.httpService.post(url, metricsDto));
      console.log('Datos recibidos:', JSON.stringify(response.data, null, 2));

      const { data } = response;
      if (!data || !data.length || !data[0].users || !data[0].users.length) {
          throw new Error('No se recibieron datos para el usuario en el mes especificado');
      }

      const monthData = data[0]; // El mes y los usuarios están en el primer objeto
      const usersData = monthData.users;

      const filteredData = usersData.map((user: any) => ({
          Month: monthData.month,
          UserId: user.userId,
          KilosFacturados: user.kilosFacturados,
          UnidadesFacturadas: user.unidadesFacturadas,
          KilosBonificados: user.kilosBonificados,
          UnidadesBonificadas: user.unidadesBonificadas,
          ImporteGenerado: user.importeGenerado
      }));

      console.log('Filas procesadas:', filteredData.length);

      if (filteredData.length === 0) {
          throw new Error('No se generaron filas para el CSV');
      }

      console.log('Primera fila de ejemplo:', filteredData[0]);

      const timestamp = new Date().getTime();
      const localFilePath = join(process.cwd(), 'temp', `user_bonificados_facturados_${timestamp}.csv`);

      if (!fs.existsSync(join(process.cwd(), 'temp'))) {
          fs.mkdirSync(join(process.cwd(), 'temp'));
      }

      await new Promise<void>((resolve, reject) => {
          const writeStream = fs.createWriteStream(localFilePath);
          const csvStream = fastcsv.format({
              headers: true,
              delimiter: ';',
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

          filteredData.forEach(row => csvStream.write(row));

          csvStream.end();
      });

      const fileContent = fs.readFileSync(localFilePath, 'utf-8');

      res.status(200).json({
          message: 'CSV generado correctamente',
          localFilePath,
          csvContent: fileContent,
          rowCount: filteredData.length,
          firstRow: filteredData[0]
      });

  } catch (error) {
      console.error('Error completo:', error);
      res.status(500).json({
          error: 'No se pudo obtener la información de bonificados y facturados',
          details: error.message,
          stack: error.stack
      });
  }
}

async generateMostSoldProductsCsvRepository(res, limit: number) {
  const metricsDto = { limit };
  const url = 'http://localhost:3001/metrics/productos-mas-vendidos';

  try {
    const response = await firstValueFrom(this.httpService.post(url, metricsDto));
    console.log('Datos recibidos:', response.data);

    // Asegúrate de que `response.data` sea un string para `parse`
    const csvData = typeof response.data === 'string' ? response.data : response.data.toString();
    const records = csvParse(csvData, {
      columns: true,
      skip_empty_lines: true
    }) as { productId: string; quantity: string }[];

    console.log('Datos parseados:', records);

    const csvRows = records.map(item => ({
      ProductId: item.productId,
      Quantity: parseInt(item.quantity, 10),
    }));

    const timestamp = new Date().getTime();
    const localFilePath = join(process.cwd(), 'temp', `most_sold_products_${timestamp}.csv`);

    if (!fs.existsSync(join(process.cwd(), 'temp'))) {
      fs.mkdirSync(join(process.cwd(), 'temp'));
    }

    await new Promise<void>((resolve, reject) => {
      const writeStream = fs.createWriteStream(localFilePath);
      const csvStream = fastcsv.format({
        headers: true,
        delimiter: ';',
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

      csvRows.forEach(row => csvStream.write(row as any));

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


async generateLessSoldProductsCsvRepository(limit: number): Promise<string> {
  const metricsDto = { limit };
  const url = 'http://localhost:3001/metrics/productos-menos-vendidos'; 

  try {
    const response = await firstValueFrom(this.httpService.post(url, metricsDto));
    console.log('Datos recibidos:', JSON.stringify(response.data, null, 2));

    if (!response.data || response.data.length === 0) {
      throw new Error('No se recibieron productos de la métrica');
    }

    // Transformar la respuesta en filas para el CSV
    const csvRows = response.data.map(item => ({
      ProductId: item.product.id,
      ProductDescription: item.product.description,
      TotalQuantity: item.totalQuantity,
    }));

    console.log('Filas procesadas:', csvRows.length);
    console.log('Primera fila de ejemplo:', csvRows[0]);

    const timestamp = new Date().getTime();
    const localFilePath = join(process.cwd(), 'temp', `least_sold_products_${timestamp}.csv`);

    // Crear directorio si no existe
    if (!fs.existsSync(join(process.cwd(), 'temp'))) {
      fs.mkdirSync(join(process.cwd(), 'temp'));
    }

    // Escribir el archivo CSV
    await new Promise<void>((resolve, reject) => {
      const writeStream = fs.createWriteStream(localFilePath);
      const csvStream = fastcsv.format({
        headers: true,
        delimiter: ';', // Cambiar a punto y coma
        quote: '"',
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

    return localFilePath;

  } catch (error) {
    console.error('Error completo:', error);
    throw new Error('No se pudo obtener la información de productos');
  }
}

}

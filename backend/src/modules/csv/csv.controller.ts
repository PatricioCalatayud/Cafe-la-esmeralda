import { Controller, Get, Post, Res, UploadedFile, UseInterceptors,Body, BadRequestException } from '@nestjs/common';
import { CsvService } from './csv.service';
import { createReadStream } from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';

@Controller('csv')
export class CsvController {
  constructor(private readonly csvService: CsvService) {}

  @Get('download-products')
  async downloadCsv(@Res() res: Response) {
    const csvFilePath = await this.csvService.generateSalesCsvService();

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=products.csv');

    const fileStream = createReadStream(csvFilePath);
    fileStream.pipe(res);
  }
  
  @Post('updateproductsfromcsv')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const fileName = `${Date.now()}-${file.originalname}`;
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv') {
          cb(null, true); // Solo aceptar archivos CSV
        } else {
          cb(new Error('Invalid file type, only CSV files are allowed!'), false);
        }
      },
    }),
  )
  async updateProductsFromCsv(@UploadedFile() file: Express.Multer.File) {
    return this.csvService.updateProductsFromCsvService(file.path);
  }


  @Post('productos-mas-vendidos')
    async getMostSoldProducts(
        @Body('limit') limit: number
    ) {
        // return await this.csvService.getMostSoldProductsService(limit);
    }
    @Post('productos-menos-vendidos')
    async getLessSoldProducts(
        @Body('limit') limit: number
    ) {
        // return await this.csvService.getLessSoldProductsService(limit);
    }

    @Post('mejores-productos')
    async getBestProducts(
        @Body('limit') limit: number,
        @Res() res: Response

    ) {
        return await this.csvService.bestAverageRatingService(limit, res);
    }
    @Post('peores-productos')
    async getWorstProducts(
        @Body('limit') limit: number,
        @Res() res: Response
    ) {
        return await this.csvService.worstAverageRatingService(limit, res);
    }

    @Post('deudores')
    async getLargestDebtors(
        @Body('limit') limit: number,
        @Res() res: Response
    ) {
        return await this.csvService.debtorsService(limit, res);
    }

    @Post('pedidos-usuario-mes')
    async getOrdersByUserIdAndDate(
        @Body('id') id: string,
        @Body('date') date: string
    ) {
        const dateSelected = new Date(date);
        
        if (isNaN(dateSelected.getTime())) {
            throw new BadRequestException('Fecha inválida');
        }
    
        // return await this.csvService.getOrdersByUserIdAndDateService(id, dateSelected);
    }

    @Post('productos-por-mes')
    async getProductsByMonth(
        @Body('date') date: string,
        @Body('productId') productId: string,
        @Body('limit') limit: number
    ) {
        const dateSelected = new Date(date);
        
        if (isNaN(dateSelected.getTime())) {
            throw new BadRequestException('Fecha inválida');
        }
    
        // return await this.csvService.getProductsByMonthService(dateSelected, productId, limit);
    }
    
    @Post('productos-vendidos')
    async geAllTimeProducts(
        @Body('productId') productId: string,
        @Body('limit') limit: number,
        @Res() res: Response
      ): Promise<void> {
          await this.csvService.geAllTimeProductsService(productId, limit, res);
      
    }

    @Post('productos-por-mes-usuario')
    async getProductsByMonthByUser(
        @Body('date') date: string,
        @Body('userId') userId: string,
        @Body('limit') limit: number
    ) {
        const dateSelected = new Date(date);
        
        if (isNaN(dateSelected.getTime())) {
            throw new BadRequestException('Fecha inválida');
        }
        
        // return await this.csvService.getProductsByMonthByUserService(dateSelected, userId, limit);
    }

    @Post('productos-por-mes-usuario-bonificados')
    async getProductsByUserByMonthBonified(
        @Body('date') date: string,
        @Body('userId') userId: string,
        @Body('limit') limit: number
    ) {
        const dateSelected = new Date(date);
        if (isNaN(dateSelected.getTime())) {
            throw new BadRequestException('Fecha inválida');
        }
        
        // return await this.csvService.getProductsByUserByMonthBonifiedService(dateSelected, userId, limit);
    }
    @Post('productos-por-mes-usuario-bonificados-importe')
    async getProductsAndImportByUserByMonthBonified(
        @Body('date') date: string,
        @Body('userId') userId: string,
        @Body('limit') limit: number
    ) {
        const dateSelected = new Date(date);
        if (isNaN(dateSelected.getTime())) {
            throw new BadRequestException('Fecha inválida');
        }
        
        // return await this.csvService.getProductsAndImportByUserByMonthBonifiedService(dateSelected, userId, limit);
    }

    @Post('productos-por-reparto-por-mes')
    async getProductsByDeliveryByMonth(
        @Body('date') date: string,
        @Body('deliveryNumber') deliveryNumber: number,
        @Body('limit') limit: number,
        @Res() res: Response
    ){

        return await this.csvService.productsByDeliveryService(deliveryNumber, date, limit, res);

    }

}

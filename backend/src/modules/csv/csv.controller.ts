import { Controller, Get, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { CsvService } from './csv.service';
import { createReadStream } from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

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

}

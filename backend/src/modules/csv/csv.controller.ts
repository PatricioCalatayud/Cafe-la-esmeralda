import { Controller, Get, Post, Res, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { CsvService } from './csv.service';
import { createReadStream } from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('csv')
export class CsvController {
  constructor(private readonly csvService: CsvService) {}

  @Get('download')
  async downloadCsv(@Res() res: Response) {
    const csvFilePath = await this.csvService.generateSalesCsvService();

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=products.csv');

    const fileStream = createReadStream(csvFilePath);
    fileStream.pipe(res);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(@Res() res: Response) {
    const csvFilePath = './cafeteria_products.csv';
    const fileStream = createReadStream(csvFilePath);
    fileStream.pipe(res);
  }

}

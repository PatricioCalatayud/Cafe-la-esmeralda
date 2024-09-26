import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { CsvService } from './csv.service';
import { createReadStream } from 'fs';

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
}

import { Injectable } from '@nestjs/common';
import { CsvRepository } from './csv.repository';

@Injectable()
export class CsvService {

    constructor(
        private readonly csvRepository: CsvRepository
    ) {}

    async generateSalesCsvService() {
        return this.csvRepository.generateSellsCsv();
    }
}

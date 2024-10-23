import { Injectable } from '@nestjs/common';
import { CsvRepository } from './csv.repository';
import { Response } from 'express';

@Injectable()

export class CsvService {
    constructor(
        private readonly csvRepository: CsvRepository
    ) {}
    
    async generateSalesCsvService() {
        return this.csvRepository.generateSellsCsv();
    }
    async processCsvService( filePath: string) {
        return this.csvRepository.processCsvRepository(filePath);
    }
    
    async updateProductsFromCsvService(filePath){
        return this.csvRepository.updateProductsFromCsvRepository(filePath);
        
    }

    async geAllTimeProductsService(productId: string, limit: number, res: Response
    ): Promise<void> {
        return this.csvRepository.getAllTimeProductsRepository(productId, limit, res);
    }

    async bestAverageRatingService(limit: number, res: Response
    ): Promise<void> {
        return this.csvRepository.bestAverageRatingRepository( limit, res);
    }

    async worstAverageRatingService(limit: number, res: Response
    ): Promise<void> {
        return this.csvRepository.worstAverageRatingRepository( limit, res);
    }
    async debtorsService(limit: number, res: Response
    ): Promise<void> {
        return this.csvRepository.debtorsRepository(limit, res);
    }
}

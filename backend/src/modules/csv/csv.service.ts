import { Injectable } from '@nestjs/common';
import { CsvRepository } from './csv.repository';
import { Response } from 'express';

@Injectable()
export class CsvService {

constructor(
    private readonly csvRepository: CsvRepository
) {}
    getMostSoldProductsService(res: Response, limit: number) {
        return this.csvRepository.generateMostSoldProductsCsvRepository(res, limit);
    }
    getLessSoldProductsService(limit: number) {
        return this.csvRepository.generateLessSoldProductsCsvRepository(limit);
    }
    
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

    async getProductsByUserMonthByMonthService(userId: string, date: string, limit: number, res: Response
    ): Promise<void> {
        return this.csvRepository.getProductsByUserMonthByMonthRepository(userId, date, limit, res);
    }
    async getProductsByUserByMonthService(userId: string, date: string, res: Response
    ): Promise<void> {
        return this.csvRepository.getOrdersByUserByMonthRepository(userId, date, res);
    }
    async productsBonifiedAndImportByUserByMonthService(userId: string, date: string, res: Response
    ): Promise<void> {
        return this.csvRepository.productsBonifiedAndImportByUserByMonthRepository(userId, date, res);
    }
    async productsBonifiedByUserByMonthService(userId: string, date: string, res: Response
    ): Promise<void> {
        return this.csvRepository.productsBonifiedByUserByMonthRepository(userId, date, res);
    }
    async getSalesReportByDeliveryService(date: string, deliveryNumber: number, limit: number, province: number, localidad: string, res: Response<any, Record<string, any>>) {
        return this.csvRepository.generateSalesReport(date, deliveryNumber, limit, province, localidad, res);
    }

    async getGenerateTotalSalesReportService(startDate:Date, endDate:Date, limit: number, res: Response) {
        return this.csvRepository.generateTotalSalesReport(startDate, endDate, limit, res);
    }

}

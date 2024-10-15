import { Injectable } from '@nestjs/common';
import { OrdersMetricsRepository } from './metrics.repository';

@Injectable()
export class OrdersMetricsService {
  constructor(
    private readonly ordersMetricsRepository: OrdersMetricsRepository,
  ) {}


  async getMostSoldProductsService(limit: number) {
    if(!limit) limit = 10
    return await this.ordersMetricsRepository.getMostSoldProductsRepository(limit);
  }
  async getLessSoldProductsService(limit: number) {
    if(!limit) limit = 10
    return await this.ordersMetricsRepository.getLessSoldProductsRepository(limit);
  }
  async getBestProductsService(limit:number) {
    return await this.ordersMetricsRepository.getBestProductsRepository(limit);
  }
  async getWorstProductsService(limit:number) {
    return await this.ordersMetricsRepository.getWorstProductsRepository(limit);
  }
  async getLargestDebtorsService(limit:number) {
    return await this.ordersMetricsRepository.getLargestDebtorsRepository(limit);
  }

  async getOrdersByUserIdAndDateService(id: string, dateSelected: Date) {
    return await this.ordersMetricsRepository.getOrdersByUserIdAndDateRepository(id, dateSelected);
  }
  async getProductsByMonthService(dateSelected: Date, productId: string, limit: number) {
    if(!limit) limit = 20
    return await this.ordersMetricsRepository.getProductsByMonthRepository(dateSelected, productId, limit);
  }
  async geAllTimeProductsService( productId:string, limit:number) {
    if(!limit) limit = 10
    return await this.ordersMetricsRepository.geAllTimeProductsRepository(productId, limit);
  }

  async getProductsByMonthByUserService(dateSelected: Date, userId: string, limit: number) {
    if(!limit) limit = 20
    return await this.ordersMetricsRepository.getProductsByMonthByUserRepository(dateSelected, userId, limit);
  }

}
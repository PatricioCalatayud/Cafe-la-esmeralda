import { Body, Controller, Get } from '@nestjs/common';
import { OrdersMetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
    constructor(private readonly ordersMetricsService: OrdersMetricsService) {}
    @Get('productos-mas-vendidos')
    async getMostSoldProducts(
        @Body('limit') limit: number
    ) {
        return await this.ordersMetricsService.getMostSoldProductsService(limit);
    }
    @Get('productos-menos-vendidos')
    async getLessSoldProducts(
        @Body('limit') limit: number
    ) {
        return await this.ordersMetricsService.getLessSoldProductsService(limit);
    }

    @Get('mejores-productos')
    async getBestProducts(
        @Body('limit') limit: number
    ) {
        return await this.ordersMetricsService.getBestProductsService(limit);
    }
    @Get('peores-productos')
    async getWorstProducts(
        @Body('limit') limit: number
    ) {
        return await this.ordersMetricsService.getWorstProductsService(limit);
    }

}

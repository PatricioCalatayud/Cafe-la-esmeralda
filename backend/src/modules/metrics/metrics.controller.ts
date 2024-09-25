import { BadRequestException, Body, Controller, Get } from '@nestjs/common';
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

    @Get('deudores')
    async getLargestDebtors(
        @Body('limit') limit: number
    ) {
        return await this.ordersMetricsService.getLargestDebtorsService(limit);
    }

    @Get('pedidos-usuario-mes')
    async getOrdersByUserIdAndDate(
        @Body('id') id: string,
        @Body('date') date: string
    ) {
        const dateSelected = new Date(date);
        
        if (isNaN(dateSelected.getTime())) {
            throw new BadRequestException('Fecha inválida');
        }
    
        return await this.ordersMetricsService.getOrdersByUserIdAndDateService(id, dateSelected);
    }

    @Get('productos-por-mes')
    async getProductsByMonth(
        @Body('date') date: string,
        @Body('productId') productId: string,
        @Body('limit') limit: number
    ) {
        const dateSelected = new Date(date);
        
        if (isNaN(dateSelected.getTime())) {
            throw new BadRequestException('Fecha inválida');
        }
    
        return await this.ordersMetricsService.getProductsByMonthService(dateSelected, productId, limit);
    }
    
    @Get('productos-vendidos')
    async geAllTimeProducts(
        @Body('productId') productId: string,
        @Body('limit') limit: number
    ) {
        return await this.ordersMetricsService.geAllTimeProductsService(productId, limit);
    }
}

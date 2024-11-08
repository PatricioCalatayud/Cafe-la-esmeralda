import { BadRequestException, Body, Controller, Get, Post, Res } from '@nestjs/common';
import { OrdersMetricsService } from './metrics.service';
import * as fastcsv from 'fast-csv';
import { Response } from 'express';

@Controller('metrics')
export class MetricsController {
    constructor(private readonly ordersMetricsService: OrdersMetricsService) {}
    // @Post('productos-mas-vendidos')
    // async getMostSoldProducts(
    //     @Body('limit') limit: number
    // ) {
    //     return await this.ordersMetricsService.getMostSoldProductsService(limit);
    // }


  @Post('productos-mas-vendidos')
  async getMostSoldProducts(
    @Body('limit') limit: number,
    @Res() res: Response,  // Usamos @Res para manipular directamente la respuesta
  ) {
    // Llamamos al servicio para obtener los productos más vendidos
    const mostSoldProducts = await this.ordersMetricsService.getMostSoldProductsService(limit);

    // Configura el encabezado para descargar el archivo como CSV
    res.setHeader('Content-Disposition', 'attachment; filename="most_sold_products.csv"');
    res.setHeader('Content-Type', 'text/csv');

    // Usa fast-csv para generar y enviar el archivo CSV
    fastcsv
      .write(mostSoldProducts, { headers: true })
      .pipe(res);
  }

    @Post('productos-menos-vendidos')
    async getLessSoldProducts(
        @Body('limit') limit: number
    ) {
        return await this.ordersMetricsService.getLessSoldProductsService(limit);
    }

    @Post('mejores-productos')
    async getBestProducts(
        @Body('limit') limit: number
    ) {
        return await this.ordersMetricsService.getBestProductsService(limit);
    }
    @Post('peores-productos')
    async getWorstProducts(
        @Body('limit') limit: number
    ) {
        return await this.ordersMetricsService.getWorstProductsService(limit);
    }

    @Post('deudores')
    async getLargestDebtors(
        @Body('limit') limit: number
    ) {
        return await this.ordersMetricsService.getLargestDebtorsService(limit);
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
    
        return await this.ordersMetricsService.getOrdersByUserIdAndDateService(id, dateSelected);
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
    
        return await this.ordersMetricsService.getProductsByMonthService(dateSelected, productId, limit);
    }
    
    @Post('productos-vendidos')
    async geAllTimeProducts(
        @Body('productId') productId: string,
        @Body('limit') limit: number
    ) {
        return await this.ordersMetricsService.geAllTimeProductsService(productId, limit);
    }

    @Post('productos-mes-por-mes-usuario')
    async getProductsByMonthByUser(
        @Body('date') date: string,
        @Body('userId') userId: string,
        @Body('limit') limit: number
    ) {
        const dateSelected = new Date(date);
        
        if (isNaN(dateSelected.getTime())) {
            throw new BadRequestException('Fecha inválida');
        }
        
        return await this.ordersMetricsService.getProductsByMonthByUserService(dateSelected, userId, limit);
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
        
        return await this.ordersMetricsService.getProductsByUserByMonthBonifiedService(dateSelected, userId, limit);
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
        
        return await this.ordersMetricsService.getProductsAndImportByUserByMonthBonifiedService(dateSelected, userId, limit);
    }

    @Post('productos-por-reparto-por-mes')
    async getProductsByDeliveryByMonth(
        @Body('date') date: string,
        @Body('deliveryNumber') deliveryNumber: number,
        @Body('limit') limit: number
    ){
        const dateSelected = new Date(date);
        if (isNaN(dateSelected.getTime())) {
            throw new BadRequestException('Fecha inválida');
        }
        return await this.ordersMetricsService.getProductsByDeliveryByMonthService(dateSelected, deliveryNumber, limit);
    }
    @Post('productos-cargo-y-sin-cargo-por-mes')
    async getProductsAndImportByMonthBonified(
        @Body('date') date: string,
        @Body('limit') limit: number
    ){
        const dateSelected = new Date(date);
        if (isNaN(dateSelected.getTime())) {
            throw new BadRequestException('Fecha inválida');
        }
        return await this.ordersMetricsService.getProductsAndImportByMonthBonifiedService(dateSelected, limit);
    }
    @Post('productos-cargo-y-sin-cargo-por-mes-detallado')
    async getProductsAndImportByMonthBonifiedDetailed(
        @Body('date') date: string,
        @Body('limit') limit: number
    ){
        const dateSelected = new Date(date);
        if (isNaN(dateSelected.getTime())) {
            throw new BadRequestException('Fecha inválida');
        }
        return await this.ordersMetricsService.getProductsAndImportByMonthBonifiedServiceDetailed(dateSelected, limit);
    }
}

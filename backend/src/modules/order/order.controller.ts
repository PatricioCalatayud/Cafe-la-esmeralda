import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { AddOrderDto } from './order.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Ordenes de compra')
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService){}

    @ApiOperation({ summary: 'Obtiene todas las ordenes', description: 'Este endpoint retorna todas las ordenes.' })
    @Get()
    async getOrders() {
        return await this.orderService.getOrders()
    }

    @ApiOperation({ summary: 'Obtiene una orden por ID.', description: 'Este endpoint retorna una orden por su ID.' })
    @Get(':id')
    async getOrderById(@Param('id', ParseUUIDPipe) id: string){
        return await this.orderService.getOrderById(id)
    }

    @ApiOperation({ summary: 'Obtiene ordenes de un usuario por su ID.', description: 'Este endpoint retorna todas las ordenes de un usuario por su ID' })
    @Get('user/:id')
    async getOrdersByUserId(@Param('id', ParseUUIDPipe) id: string){
        return await this.orderService.getOrdersByUserId(id)
    }

    @ApiOperation({ summary: 'Crea una orden de compra usando AddOrderDto.', description: 'Este endpoint crea una orden de compra usando AddOrderDto.' })
    @Post()
    async createOrder(@Body() orderInfo: AddOrderDto) {
        const { userId, products, address, discount, deliveryDate } = orderInfo;
        return await this.orderService.createOrder(userId, products, address, Number(discount), deliveryDate);
    }

    // SIN DOCUMENTAR YA QUE ESTÁ INCOMPLETA
    @Delete(':id')
    async deleteOrder() {
        
    }
}

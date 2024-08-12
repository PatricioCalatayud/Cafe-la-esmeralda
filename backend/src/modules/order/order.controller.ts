import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { AddOrderDto } from './order.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Ordenes de compra')
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService){}

    @ApiOperation({ summary: 'Obtener todas las ordenes', description: 'Este endpoint retorna todas las ordenes.' })
    @Get()
    async GetOrders(){
        return await this.orderService.GetOrders()
    }

    @ApiOperation({ summary: 'Obtener una orden por ID.', description: 'Este endpoint retorna una orden por su ID.' })
    @Get(':id')
    async GetOrderById(@Param('id', ParseUUIDPipe) id: string){
        return await this.orderService.GetOrderById(id)
    }

    @ApiOperation({ summary: 'Obtener ordenes de un usuario por su ID.', description: 'Este endpoint retorna todas las ordenes de un usuario por su ID' })
    @Get('user/:id')
    async GetOrdersByUserId(@Param('id', ParseUUIDPipe) id: string){
        return await this.orderService.GetOrdersByUserId(id)
    }

    @ApiOperation({ summary: 'Crea una orden de compra usando AddOrderDto.', description: 'Este endpoint crea una orden de compra usando AddOrderDto.' })
    @Post()
    async createOrder(@Body() orderInfo: AddOrderDto) {
        const { userId, products, address, discount, deliveryDate } = orderInfo;
        return await this.orderService.addOrder(userId, products, address, Number(discount), deliveryDate);
    }

    // SIN DOCUMENTAR YA QUE ESTÁ INCOMPLETA
    @Delete(':id')
    async deleteOrder() {
        
    }
}

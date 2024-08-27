import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { AddOrderDto, UpdateOrderDto } from './order.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Order } from 'src/entities/order.entity';

@ApiTags('Ordenes de compra')
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService){}

    @ApiOperation({ summary: 'Obtiene todas las ordenes', description: 'Este endpoint retorna todas las ordenes.' })
    @Get()
    async getOrders(
      @Query('page', new DefaultValuePipe(1)) page: number,
      @Query('limit', new DefaultValuePipe(10)) limit: number)
      : Promise<{ data: Order[], total: number }>
    {
      return await this.orderService.getOrders(page, limit);
    }

    @ApiOperation({ summary: 'Obtiene una orden por ID', description: 'Este endpoint retorna una orden por su ID.' })
    @Get(':id')
    async getOrderById(@Param('id', ParseUUIDPipe) id: string) {
        return await this.orderService.getOrderById(id)
    }

    @ApiOperation({ summary: 'Obtiene ordenes de un usuario por su ID', description: 'Este endpoint retorna todas las ordenes de un usuario por su ID' })
    @Get('user/:id')
    async getOrdersByUserId (
      @Param('id', ParseUUIDPipe) id: string,
      @Query('page', new DefaultValuePipe(1)) page: number,
      @Query('limit', new DefaultValuePipe(10)) limit: number)
      : Promise<{ data: Order[], total: number }>
    {
      return await this.orderService.getOrdersByUserId(id, page, limit);
    }

    @ApiOperation({ summary: 'Crea una orden de compra', description: 'Este endpoint crea una orden de compra usando AddOrderDto.' })
    @Post()
    async createOrder(@Body() orderInfo: AddOrderDto) {
        const { userId, products, address, account } = orderInfo;
        return await this.orderService.createOrder(userId, products, address, account);
    }

    @ApiOperation({ summary: 'Actualiza una orden de compra', description: 'Este endpoint actualiza una orden de compra, recibe el ID de la orden por param y updateOrderDto por body.'})
    @Put(':id')
    async updateOrder(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() updateOrderDto: UpdateOrderDto
    ) {
      return await this.orderService.updateOrder(id, updateOrderDto);
    }

    @ApiOperation({ summary: 'Elimina una orden de la base de datos por su ID', description: 'Este endpoint elimina una orden de la base de datos por su ID.' })
    @Delete(':id')
    async deleteOrder(@Param('id', ParseUUIDPipe) id: string) {
        return await this.orderService.deleteOrder(id);
    }        
}


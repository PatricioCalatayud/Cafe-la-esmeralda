import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { AddOrderDto } from './order.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
@ApiTags('Ordenes')
@Controller('order')
export class OrderController {

    constructor(
        private readonly orderService: OrderService,
    ){}
    @ApiOperation({
        summary:'Obtener ordenes',
        description:'Obtiene todas las ordenes, tiene que estar registrado'
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Get()
    async GetAll(){
        return await this.orderService.getAll()
    }   
    @ApiOperation({
        summary:'Obtener ordenes por id',
        description:'Obtiene ordenes especificas, tiene que estar registrado'
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Get(':id')
    async GetById(@Param('id', ParseUUIDPipe) id: string){
        return await this.orderService.getById(id)
        
    }
    
    @ApiOperation({
        summary:'Obtener ordenes por usuario',
        description:'Obtiene ordenes especificas de un usuario, tiene que estar registrado'
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Get('user/:id')
    async GetByUserId(@Param('id', ParseUUIDPipe) id: string){
        return await this.orderService.getByUserId(id)
        
    }
    
    @ApiOperation({
        summary:'Crear ordenes',
        description:'Crea una nueva orden, tiene que estar registrado'
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Post()
    async addOne(@Body() orderInfo:AddOrderDto){    
        const {userId,products,adress,cuponDescuento,deliveryDate} = orderInfo
        return await this.orderService.addOrder(userId,products,adress,Number(cuponDescuento),deliveryDate)
    }
    
    @ApiOperation({
        summary:'Eliminar ordenes',
        description:'Elimina una orden especifica, tiene que estar registrado'
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Delete(':id')
    async deleteOne(){
        
    }

}

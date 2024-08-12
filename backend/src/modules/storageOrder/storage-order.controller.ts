import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { StorageOrderService } from './storage-order.service';

import { CreateOrderStorageDto } from './storage-order.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('storage-order')
@Controller('storage-order')
export class StorageOrderController {

    constructor(
        private readonly storageOrderService:StorageOrderService
    ){}
    @ApiOperation({
        summary:'Persistencia Order',
        description:'Esta ruta se usa para obtener la permanencia de de orden de un usuario por un tiempo'

    })
    @ApiBearerAuth()
    @Get(':id')
    getStoreUser(@Param('id', ParseUUIDPipe) userId:string){
        return this.storageOrderService.getByID(userId)
    }
    
    @ApiOperation({
        summary:'Crear Persistencia Order',
        description:'Esta ruta se usa para obtener la persistencia de de orden especifica de un usuario por un tiempo'
        
    })
    @ApiBearerAuth()
    @Post()
    createStorageOrder(@Body() orderInfo:CreateOrderStorageDto){
        const{userId,products}=orderInfo
        return this.storageOrderService.storage(userId,products)
    }
    
    @ApiOperation({
        summary:'Eliminar Persistencia Order',
        description:'Esta ruta se usa para eliminar la persistencia de de orden de un usuario por un tiempo'
        
    })
    @ApiBearerAuth()
    @Delete('id')
    deleteStorageOrder(@Param('id',ParseUUIDPipe)userId:string){
        return this.deleteStorageOrder(userId)
    }
}


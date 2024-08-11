import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, ParseFilePipeBuilder, ParseUUIDPipe, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductValidationInterceptor } from 'src/interceptors/productValidatorInterceptor';
import { CreateProductdto, UpdatedProductdto } from './dtos/products.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
@ApiTags('Productos')
@Controller('products')
export class ProductsController {

    constructor(
        private readonly productService: ProductsService,
    ){}

    @Get()
    @ApiOperation({
        summary: 'Obtiene todos los productos',
        description: 
            'Obtiene todos los productos de la base de datos',
    })
    async getAll(@Query('category') category: string){

        if(category) 
            return this.productService.getAllByCategory(category)
        else
            return this.productService.getAll()
        
    }

    @Get("/available")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Obtiene todos los productos disponibles',
        description: 
            'Obtiene todos los productos disponibles de la base de datos',
    })
    async getAllAvailable(@Query('category') category: string){
        if(category) 
            return this.productService.getAvailableByCategory(category)
        else
            return this.productService.getAvailable()
    }    

    @Get("/:id")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Obtiene un producto',
        description: 
            'Obtiene un producto de la base de datos',
    })
    async getById(@Param('id', ParseUUIDPipe) id: string){
        return this.productService.getById(id)
    }


    @Post()
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Crea un nuevo producto',
        description: 
            'Crea un nuevo producto en la base de datos',
    })
    @UseInterceptors(ProductValidationInterceptor)
    @UseInterceptors(FileInterceptor('file'))
    async createProduct(@Body() productInfo:CreateProductdto,
                        @UploadedFile()file?: Express.Multer.File){
        return this.productService.addProduct(productInfo,file)
        
    } 
    
    @Put(':id')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Actualiza un producto',
        description: 
            'Actualiza un producto de la base de datos',
    })
    @UseInterceptors(ProductValidationInterceptor)
    @UseInterceptors(FileInterceptor('file'))
    async updateProuct(@Param('id', ParseUUIDPipe) id: string,
                        @Body() productInfo:UpdatedProductdto,
                        @UploadedFile()file?: Express.Multer.File){

        return this.productService.updateProduct(id,productInfo,file)
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Elimina un producto',
        description: 
            'Elimina un producto de la base de datos',
    })
    async deleteProduct(@Param('id', ParseUUIDPipe) id: string){
        return await this.productService.deleteProduct(id)
    }
    
}

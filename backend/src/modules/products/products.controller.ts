import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductValidationInterceptor } from 'src/interceptors/productValidatorInterceptor';
import { CreateProductDto } from './dtos/products.dto';
import { UpdatedProductDto } from './dtos/updatedproduct.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enum/roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';

@ApiTags('Productos')
@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductsService){}

    @Get()
    @ApiOperation({ summary: 'Obtiene todos los productos', description: 'Este endpoint retorna todos los productos.' })
    async getAll(@Query('category') category: string){
        if(category) 
            return this.productService.getAllByCategory(category)
        else
            return this.productService.getAll()
    }

    @Get("available")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtiene todos los productos disponibles', description: 'Este endpoint retorna todos los productos disponibles.' })
    async getAllAvailable(@Query('category') category: string){
        if(category) 
            return this.productService.getAvailableByCategory(category)
        else
            return this.productService.getAvailable()
    }    

    @Post()
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crea un nuevo producto', description: 'Este endpoint crea un nuevo producto.',})
    @UseInterceptors(ProductValidationInterceptor)
    @UseInterceptors(FileInterceptor('file'))
    async createProduct(@Body() productInfo:CreateProductDto, @UploadedFile() file?: Express.Multer.File) {
        return this.productService.addProduct(productInfo,file)
    } 
    
    @Get(':id')
    @ApiOperation({ summary: 'Obtiene un producto', description: 'Este endpoint retorna un producto.' })
    
    async getById(@Param('id', ParseUUIDPipe) id: string) {
        console.log('Controlador - ID:', id); 
        const result = await this.productService.getById(id);
        console.log('Controlador - Resultado:', result); 
        return result;
    }
    @Put(':id')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Actualiza un producto', description: 'Este endpoint actualiza un producto por su ID.' })
    @UseInterceptors(FileInterceptor('file'))
    async updateProuct(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() productInfo:UpdatedProductDto,
        @UploadedFile()file?: Express.Multer.File) {
        return this.productService.updateProduct(id,productInfo,file)
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Elimina un producto', description: 'Este endpoint elimina un producto por su ID.' })
    async deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
        return await this.productService.deleteProduct(id)
    }
}
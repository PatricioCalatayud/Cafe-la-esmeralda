import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdatedProductDto } from './dtos/products.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enum/roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { Product } from 'src/entities/products/product.entity';

@ApiTags('Productos')
@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductsService) {}

    @Get()
    @ApiOperation({ summary: 'Obtiene todos los productos', description: 'Este endpoint retorna todos los productos.' })
    async getAll(
        @Query('category') category: string, 
        @Query('page', new DefaultValuePipe(1)) page: number, 
        @Query('limit', new DefaultValuePipe(10)) limit: number)
        : Promise<{ data: Product[], total: number }>
    {
        if(category) return this.productService.getAllByCategory(category, page, limit);
        else return this.productService.getAllService(page, limit);
    }

    @Get("available")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtiene todos los productos disponibles', description: 'Este endpoint retorna todos los productos disponibles.' })
    async getAllAvailable(@Query('category') category: string) {
        if (category) 
            return this.productService.getAvailableByCategory(category);
        else
            return this.productService.getAvailable();
    }

    @Post()
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crea un nuevo producto', description: 'Este endpoint crea un nuevo producto.' })
    @UseInterceptors(FileInterceptor('file'))
    async createProduct(@Body() productInfo: CreateProductDto, @UploadedFile() file?: Express.Multer.File) {
        return this.productService.addProduct(productInfo, file);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtiene un producto', description: 'Este endpoint retorna un producto por su ID.' })
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
    async updateProduct(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() productInfo: UpdatedProductDto,
        @UploadedFile() file?: Express.Multer.File) {
        return this.productService.updateProduct(id, productInfo, file);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Elimina un producto', description: 'Este endpoint elimina un producto por su ID.' })
    async deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
        return await this.productService.deleteProduct(id);
    }
}

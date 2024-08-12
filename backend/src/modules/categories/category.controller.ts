import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Categorías')
@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService){}
    
    @Get()
    @ApiOperation({ summary: 'Obtener todas las donaciones', description: 'Este endpoint retorna todas las categorías.' })
    async getCategories() {
        return this.categoryService.getCategories()
    }
}

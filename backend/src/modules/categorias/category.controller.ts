import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('Categorias')
@Controller('category')
export class CategoryController {

    constructor(
        private readonly categoryService: CategoryService,
    ){}
    @ApiOperation({
        summary: 'Todas las categorias',
        description:
            ' Endpoint donde se obtienen todas las categorias',            
    })
    @Get()
        async getCategories(){
        return this.categoryService.getCategories()
    }

}

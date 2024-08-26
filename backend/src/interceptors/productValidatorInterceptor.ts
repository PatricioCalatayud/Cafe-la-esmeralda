import { BadRequestException, CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Category } from "src/entities/category.entity";
import { CreateCoffeeDto, UpdateCoffeeDto } from "src/modules/products/dtos/coffee.dto";
import { CreateProductDto } from "src/modules/products/dtos/products.dto";
import { UpdatedProductDto } from "src/modules/products/dtos/updatedproduct.dto";
import { Repository } from "typeorm";

export class ProductValidationInterceptor implements NestInterceptor {

    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler<any>) {
        const request = context.switchToHttp().getRequest();
        const body: CreateProductDto = request.body;
        const method = request.method;
        
        if (!body.categoryID || !this.isUUID(body.categoryID)) {
            throw new BadRequestException('categoryID debe ser un UUID válido y no debe estar vacío.');
        }
        
        const foundCategory = await this.categoryRepository.findOne({ where: { id: body.categoryID } });
        console.log("Found Category:", foundCategory);
        
        if (!foundCategory) {
            throw new BadRequestException(`Categoría "${body.categoryID}" no existe.`);
        }
        
        let dtoClass;
        if (foundCategory.name.toLowerCase() === 'coffee') {
            dtoClass = method === 'POST' ? CreateCoffeeDto : UpdateCoffeeDto;
        } else {
            dtoClass = method === 'POST' ? CreateProductDto : UpdatedProductDto;
        }
        
        const dtoObject = plainToClass(dtoClass, body) as object;
        console.log("DTO Object:", dtoObject);
        
        const errors = await validate(dtoObject);
        console.log("Validation Errors:", errors);
        
        if (errors.length > 0) {
            throw new BadRequestException(`Validación fallida: ${errors.map(err => err.toString()).join(', ')}`);
        }
        
        request.body = dtoObject;
        return next.handle();
    }
    
    private isUUID(value: string): boolean {
        const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        return uuidPattern.test(value);
    }
}

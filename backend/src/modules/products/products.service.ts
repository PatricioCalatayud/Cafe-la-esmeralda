import { BadRequestException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Product } from 'src/entities/products/product.entity';
import { Subproduct } from 'src/entities/products/subprodcut.entity';
import { Repository } from 'typeorm';
import { CreateCoffeeDto, UpdateCoffeDto } from './dtos/coffee.dto';
import { ImageService } from './image.service';
import { Coffee } from 'src/entities/products/product-coffee.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product) private productRepository: Repository<Product>,
        @InjectRepository(Subproduct) private subproductRepository: Repository<Subproduct>,
        @InjectRepository(Category) private categoryRepository: Repository<Category>,
        @InjectRepository(Coffee) private coffeeRepository: Repository<Coffee>,
        private readonly imageService: ImageService,
    ){}

    async getAll() {
        return await this.productRepository.find({ where: { isDeleted: false }, relations: { category: true, subproducts: true }}); 
    }

    async getAvailable() {
        return await this.productRepository.find({ where: { isAvailable: true, isDeleted: false }});
    }

    async getAllByCategory(category: string) {
        const categoryFound = await this.categoryRepository.findOne({ where: { name: category }});
        
        if(!categoryFound) throw new NotFoundException(`No se encontró la categoría "${category}".`);

        return await this.productRepository.createQueryBuilder('products')
            .innerJoinAndSelect('products.category', 'categories')
            .where('categories.id = :categoriaId', { categoriaId: categoryFound.id })
            .andWhere('products.isDeleted = :isDeleted', { isDeleted: false })
            .getMany();
        }

    async getAvailableByCategory(category: string) {
        const categoryFound = await this.categoryRepository.findOne({ where: { name: category }});
        if(!categoryFound) throw new NotFoundException(`No se encontró la categoría "${category}".`);

        return await this.productRepository.createQueryBuilder('products')
            .innerJoinAndSelect('products.category', 'categories')
            .where('categories.id = :categoriaId', { categoriaId: categoryFound.id })
            .andWhere('products.isDeleted = :isDeleted', { isDeleted: false })
            .andWhere('products.isAvailable = :isAvailable', { isAvailable: true })
            .getMany();
        }

    async getById(id: string) {
        const product = await this.productRepository.findOne({ where: {id, isDeleted: false, isAvailable: true}, relations: { category: true }});
        if(!product) throw new NotFoundException(`No se encontró el producto. ID: ${id}`);
        return product;
    }   

    async addProduct(infoProduct: Partial<CreateCoffeeDto>, file?: Express.Multer.File) {
        const foundProduct = await this.productRepository.findOneBy({ article_id: infoProduct.article_id });
        if(foundProduct) throw new BadRequestException(`Ya existe un producto con el ID ${infoProduct.article_id}.`);
        
        const foundCategory = await this.categoryRepository.findOneBy({ id: infoProduct.categoryID });
        if(!foundCategory) throw new BadRequestException(`Categoría "${infoProduct.categoryID}" no existe.`);

        let imgURL: string | undefined;

        if(file) {
            imgURL = await this.imageService.uploadFile(file);
            if(!imgURL) throw new UnprocessableEntityException(`Error al cargar la imagen`);
        }

        let builder = this.productRepository;
        if(foundCategory.name === 'coffee') { // REVISAR PARA QUE SEA Coffe con C mayuscula
            builder = this.coffeeRepository;
        }

        const newProduct = builder.create(
            {
                ...infoProduct,
                imgUrl: imgURL,
                category: foundCategory
            }
        )
        await builder.save(newProduct);

        return newProduct;
    }


    async updateProduct(id: string, infoProduct: Partial<UpdateCoffeDto>, file?: Express.Multer.File) {
        const product = await this.productRepository.findOne({ where: { id }, relations: { category: true }});
        if(!product) throw new NotFoundException(`No se encontró el producto. ID: ${id}`);
        
        let builder = this.productRepository;
        if(product.category.name === 'coffee') builder = this.coffeeRepository;

        const{categoryID, ...updateData} = infoProduct;
    
        if(file) {
            const imgURL = await this.imageService.uploadFile(file);
            if(!imgURL) throw new UnprocessableEntityException(`Error al cargar la imagen`)
            updateData["imgUrl"] = imgURL;
        }

        if(categoryID) {
            const foundCategory = await this.categoryRepository.findOneBy({ id: categoryID });
            if(!foundCategory) throw new NotFoundException(`Categoria "${categoryID}" no existe.`)
            updateData["category"] = foundCategory;
        }

        await builder.update(id, updateData);

        return product;
    }

    async deleteProduct(id: string) {
        const product = await this.productRepository.findOne({ where: { id }, relations: { category: true }});
        if(!product) throw new NotFoundException(`No se encontró el producto. ID: ${id}`);
        
        await this.productRepository.update(id, { isDeleted: true });

        return { message:`El producto con id ${id} fue eliminado`}
    }
}
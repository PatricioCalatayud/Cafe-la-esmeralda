import { BadRequestException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Product } from 'src/entities/products/product.entity';
import { Subproduct } from 'src/entities/products/subprodcut.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/products.dto';
import { UpdateCoffeeDto } from './dtos/coffee.dto';
import { ImageService } from '../images/image.service';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product) private productRepository: Repository<Product>,
        @InjectRepository(Subproduct) private subproductRepository: Repository<Subproduct>,
        @InjectRepository(Category) private categoryRepository: Repository<Category>,
        private readonly imageService: ImageService,
    ){}

    async getAll(page: number, limit: number): Promise<Product[]> {
        const skip = (page - 1) * limit;
      
        const products = await this.productRepository.find({
            where: { isDeleted: false },
            relations: { category: true, subproducts: true },
            skip,
            take: limit,
        });
      
        return products;
    }

    async getAvailable(): Promise<Product[]> {
        return await this.productRepository.find({ where: { isDeleted: false }});
    }

    async getAllByCategory(category: string, page: number = 1, limit: number = 10): Promise<Product[]> {
        const categoryFound = await this.categoryRepository.findOne({ where: { name: category }});
        if (!categoryFound) throw new NotFoundException(`No se encontró la categoría "${category}".`);
      
        const skip = (page - 1) * limit;
      
        const products = await this.productRepository.createQueryBuilder('products')
          .innerJoinAndSelect('products.category', 'categories')
          .where('categories.id = :categoryId', { categoryId: categoryFound.id })
          .andWhere('products.isDeleted = :isDeleted', { isDeleted: false })
          .skip(skip)
          .take(limit)
          .getMany();
      
        return products;
    }

    async getAvailableByCategory(category: string): Promise<Product[]> {
        const categoryFound = await this.categoryRepository.findOne({ where: { name: category }});
        if(!categoryFound) throw new NotFoundException(`No se encontró la categoría "${category}".`);

        return await this.productRepository.createQueryBuilder('products')
            .innerJoinAndSelect('products.category', 'categories')
            .where('categories.id = :categoryId', { categoryId: categoryFound.id })
            .andWhere('products.isDeleted = :isDeleted', { isDeleted: false })
            .andWhere('products.isAvailable = :isAvailable', { isAvailable: true })
            .getMany();
    }

    async getById(id: string): Promise<Product> {
        const product = await this.productRepository.findOne({ 
            where: { id, isDeleted: false,}, 
            relations: { category: true, subproducts: true, }
        });
        if (!product) throw new NotFoundException(`No se encontró el producto. ID: ${id}`);
        return product;
    }

    async addProduct(infoProduct: Partial<CreateProductDto>, file?: Express.Multer.File): Promise<Product> {
        const foundCategory = await this.categoryRepository.findOneBy({ id: infoProduct.categoryID });
        if (!foundCategory) throw new BadRequestException(`Categoría "${infoProduct.categoryID}" no existe.`);
    
        let imgURL: string | undefined;
    
        if (file) {
            imgURL = await this.imageService.uploadFile(file);
            if (!imgURL) throw new UnprocessableEntityException(`Error al cargar la imagen`);
        }
    
        const { categoryID, subproducts, ...productData } = infoProduct;
    
        const newProduct = this.productRepository.create({
            ...productData,
            imgUrl: imgURL,
            category: foundCategory,
        });
    
        const savedProduct = await this.productRepository.save(newProduct);
    
        if (subproducts && subproducts.length > 0) {
            for (const subproductData of subproducts) {
                const newSubproduct = this.subproductRepository.create({
                    ...subproductData,
                    product: savedProduct,
                });
                await this.subproductRepository.save(newSubproduct);
            }
        }
    
        return savedProduct;
    }
    
    async updateProduct(id: string, infoProduct: Partial<UpdateCoffeeDto>, file?: Express.Multer.File): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id }, relations: { category: true }});
        if (!product) throw new NotFoundException(`No se encontró el producto. ID: ${id}`);
        
        const { categoryID, ...updateData } = infoProduct;
    
        if (file) {
            const imgURL = await this.imageService.uploadFile(file);
            if (!imgURL) throw new UnprocessableEntityException(`Error al cargar la imagen`);
            updateData["imgUrl"] = imgURL;
        }

        if (categoryID) {
            const foundCategory = await this.categoryRepository.findOneBy({ id: categoryID });
            if (!foundCategory) throw new NotFoundException(`Categoria "${categoryID}" no existe.`);
            updateData["category"] = foundCategory;
        }

        await this.productRepository.update(id, updateData);

        return product;
    }

    async deleteProduct(id: string): Promise<{ message: string }> {
        const product = await this.productRepository.findOne({ where: { id }, relations: { category: true }});
        if (!product) throw new NotFoundException(`No se encontró el producto. ID: ${id}`);
        
        await this.productRepository.update(id, { isDeleted: true });

        return { message: `El producto con id ${id} fue eliminado` };
    }
}

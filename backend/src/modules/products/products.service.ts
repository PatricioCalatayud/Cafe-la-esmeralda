import { BadRequestException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Product } from 'src/entities/products/product.entity';
import { Subproduct } from 'src/entities/products/subproduct.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/products.dto';
import { ImageService } from '../images/image.service';
import { UpdatedProductDto } from './dtos/updatedproduct.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product) private productRepository: Repository<Product>,
        @InjectRepository(Subproduct) private subproductRepository: Repository<Subproduct>,
        @InjectRepository(Category) private categoryRepository: Repository<Category>,
        private readonly imageService: ImageService,
    ){}

    async getAll(page: number, limit: number): Promise<{ data: Product[], total: number }> {
        const [data, total] = await this.productRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            where: { isDeleted: false },
            relations: { category: true, subproducts: true }
        })
      
        return { data, total };
    }

    async getAllByCategory(category: string, page: number = 1, limit: number = 10): Promise<{ data: Product[], total: number }> {
        const categoryFound = await this.categoryRepository.findOne({ where: { name: category }});
        if (!categoryFound) throw new NotFoundException(`No se encontró la categoría "${category}".`);
      
        const [data, total] = await this.productRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            where: { isDeleted: false, category: { id: categoryFound.id } },
            relations: { category: true, subproducts: true }
        })

        return { data, total };
    }

    async getAvailable(): Promise<Product[]> {
        return await this.productRepository.find({ where: { isDeleted: false }});
    }

    async getAvailableByCategory(category: string) {
        const categoryFound = await this.categoryRepository.findOne({ where: { name: category }});
        if(!categoryFound) throw new NotFoundException(`No se encontró la categoría "${category}".`);

        return await this.productRepository.createQueryBuilder('products')
            .innerJoinAndSelect('products.category', 'categories')
            .where('categories.id = :categoryId', { categoryId: categoryFound.id })
            .andWhere('products.isDeleted = :isDeleted', { isDeleted: false })
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
    
        const { categoryID, subproducts,presentacion,tipoGrano, ...productData } = infoProduct;
    
        const newProduct = this.productRepository.create({
            ...productData,
            imgUrl: imgURL,
            category: foundCategory,
            presentacion,
            tipoGrano
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
    
    async updateProduct(id: string, infoProduct: UpdatedProductDto, file?: Express.Multer.File): Promise<Product> {
        const product = await this.productRepository.findOne({ 
            where: { id }, 
            relations: { category: true, subproducts: true } 
        });
        if (!product) throw new NotFoundException(`No se encontró el producto. ID: ${id}`);
    
        const { categoryID, subproducts, presentacion, tipoGrano, ...updateData } = infoProduct;
    
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
    
        if (subproducts && subproducts.length > 0) {
            for (const subproductDto of subproducts) {
                const { id: subproductId, ...subproductData } = subproductDto;
    
                if (subproductId) {
                    const existingSubproduct = await this.subproductRepository.findOneBy({ id: subproductId });
                    if (existingSubproduct) {
                        await this.subproductRepository.update(subproductId, subproductData);
                    }
                } else {
                    const newSubproduct = this.subproductRepository.create({
                        ...subproductData,
                        product: product,
                    });
                    await this.subproductRepository.save(newSubproduct);
                }
            }
    
            const subproductIds = subproducts.map(sp => sp.id).filter(id => id);
            const subproductsToRemove = product.subproducts.filter(sp => !subproductIds.includes(sp.id));
            for (const subproduct of subproductsToRemove) {
                await this.subproductRepository.delete(subproduct.id);
            }
        }
    
        return this.productRepository.findOne({ 
            where: { id }, 
            relations: { category: true, subproducts: true }
        });
    }
    
    async deleteProduct(id: string): Promise<{ message: string }> {
        const result = await this.productRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException(`No se encontró el producto. ID: ${id}`);
    
        return { message: `El producto con id ${id} fue eliminado permanentemente.` };
    }
}

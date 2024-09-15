import { BadRequestException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Product } from 'src/entities/products/product.entity';
import { Subproduct } from 'src/entities/products/subproduct.entity';
import { DeleteResult, In, Repository } from 'typeorm';
import { CreateProductDto, UpdatedProductDto } from './dtos/products.dto';
import { ImageService } from '../images/image.service';

@Injectable()
export class ProductsRepository {
    constructor(
        @InjectRepository(Product) private productRepository: Repository<Product>,
        @InjectRepository(Subproduct) private subproductRepository: Repository<Subproduct>,
        @InjectRepository(Category) private categoryRepository: Repository<Category>,
        private readonly imageService: ImageService,
    ){}

    async getAllRepository(page: number, limit: number): Promise<{ data: Product[], total: number }> {
        console.log("lega", page, limit)
        const [data, total] = await this.productRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
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
            where: {  category: { id: categoryFound.id } },
            relations: { category: true, subproducts: true }
        })

        return { data, total };
    }
    async getById(id: string): Promise<Product> {
        const product = await this.productRepository.findOne({ 
            where: { id, }, 
            relations: { category: true, subproducts: true, }
        });
        if (!product) throw new NotFoundException(`No se encontró el producto. ID: ${id}`);
        return product;
    }
    
    async getAvailable(): Promise<Product[]> {
        const productsAvailable = await this.subproductRepository.find({ where:{isAvailable:true}});
        return await this.productRepository.find({ where: { id: In(productsAvailable.map(subproduct => subproduct.product.id)) } });
    }

    async getAvailableByCategory(category: string) {
        const categoryFound = await this.categoryRepository.findOne({ where: { name: category }});
        if(!categoryFound) throw new NotFoundException(`No se encontró la categoría "${category}".`);

        return await this.productRepository.createQueryBuilder('products')
            .innerJoinAndSelect('products.category', 'categories')
            .where('categories.id = :categoryId', { categoryId: categoryFound.id })
            .getMany();
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
    
    async updateProduct(
        id: string, 
        infoProduct: Partial<UpdatedProductDto>, 
        file?: Express.Multer.File
    ): Promise<Product> {
        const product = await this.productRepository.findOne({ 
            where: { id }, 
            relations: { category: true, subproducts: true }
        });
        if (!product) throw new NotFoundException(`No se encontró el producto. ID: ${id}`);
        
        const { categoryID, subproducts, ...updateData } = infoProduct;
    
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
    
        if (subproducts && subproducts.length > 0) {
            for (const subproductData of subproducts) {
                if (subproductData.id) {
                    const existingSubproduct = await this.subproductRepository.findOne({
                        where: { id: subproductData.id, product: { id } }
                    });
                    if (existingSubproduct) {
                        const isAvailable = String(subproductData.isAvailable) === 'true';

                        await this.subproductRepository.update(existingSubproduct.id, {
                            ...subproductData,
                        isAvailable: isAvailable
                        });
                    } else {
                        throw new NotFoundException(`No se encontró el subproducto con ID: ${subproductData.id}`);
                    }
                } else {
                    const newSubproduct = this.subproductRepository.create({
                        ...subproductData,
                        product: product 
                    });
                    await this.subproductRepository.save(newSubproduct);
                }
            }
        }
    
        if (Object.keys(updateData).length > 0){
            await this.productRepository.update(id, updateData);
        }
        return await this.productRepository.findOne({ 
            where: { id }, 
            relations: { category: true, subproducts: true }
        });
    }
    

    async deleteProduct(id: string): Promise<DeleteResult> {
        const result = await this.productRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException(`No se encontró el producto. ID: ${id}`);
    
        return result;
    }
}

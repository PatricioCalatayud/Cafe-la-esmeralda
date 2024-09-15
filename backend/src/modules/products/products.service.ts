import { Product } from "src/entities/products/product.entity";
import { ImageService } from "../images/image.service";
import { ProductsRepository } from "./products.repository";
import { CreateProductDto, UpdatedProductDto } from "./dtos/products.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductsService {
constructor(
    private readonly productRepository: ProductsRepository,
    private readonly imageService: ImageService,

) {}  
    async getAllService (page: number, limit: number): Promise<{ data: Product[], total: number }> {
        if (!page || !limit)  throw new Error('page y limit son obligatorios');
        return await this.productRepository.getAllRepository(page, limit);
    }

    async getAllByCategory(category: string, page: number = 1, limit: number = 10): Promise<{ data: Product[], total: number }> {
        if (!category)  throw new Error('category es obligatorio');
        return this.productRepository.getAllByCategory(category, page, limit);
    }

    async getById(id: string): Promise<Product> {
        if (!id)  throw new Error('id es obligatorio');
        return this.productRepository.getById(id);
    }

    async getAvailable(): Promise<Product[]> {
        return this.productRepository.getAvailable();
    }

    async getAvailableByCategory(category: string) {
        if (!category)  throw new Error('category es obligatorio');
        return this.productRepository.getAvailableByCategory(category);
    }

    async addProduct(product: CreateProductDto, file?: Express.Multer.File): Promise<Product> {
        if (!product)  throw new Error('product es obligatorio');
        return this.productRepository.addProduct(product, file);
    }

    async updateProduct(id: string, product: UpdatedProductDto, file?: Express.Multer.File): Promise<Product> {
        if (!id || !product)  throw new Error('id y product son obligatorios');
        return this.productRepository.updateProduct(id, product, file);
    }

    async deleteProduct(id: string): Promise<{ message: string }> {
        if (!id)  throw new Error('id es obligatorio');
        const deletedProduct = await this.productRepository.deleteProduct(id);
        if (deletedProduct.affected === 0) throw new Error('No se encontro el producto');
        return { message: `El producto con id ${id} fue eliminado permanentemente.` };
    }
}
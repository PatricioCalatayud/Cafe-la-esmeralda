import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/products/product.entity';
import { Rating } from 'src/entities/ratings.entity';

@Injectable()
export class ProductRatingService {
    constructor(
        @InjectRepository(Rating) private ratingRepository: Repository<Rating>,
        @InjectRepository(Product) private productRepository: Repository<Product>,
    ){}

    async rateProduct(userId:string, productId:string, ratingValue:number):Promise<Rating>{
        const product = await this.productRepository.findOne({where:{id:productId}})
        if (!product) throw new NotFoundException(`No se encontro el producto. ID: ${productId}`)
        
        const  rating = this.ratingRepository.create({
            rating:ratingValue,
            user:{id:userId},
            product:{id:productId}
        })
        await this.ratingRepository.save(rating)
        await this.updateAverageRating(productId)
    return rating
    }

    async updateAverageRating(productId:string):Promise<void>{
        const ratings = await this.ratingRepository.find({ where: { product: { id:productId } } } )
        const average = ratings.reduce((acc,ratings)=>acc + ratings.rating, 0)/ratings.length
        await this.productRepository.update(productId,{averageRating:average})
    }
}

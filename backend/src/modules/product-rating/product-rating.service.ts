import { Injectable, NotFoundException } from "@nestjs/common";
import { ProductRatingRepository } from "./product-rating.repository";
import { Rating } from "src/entities/ratings.entity";

@Injectable()
export class ProductRatingService {
    constructor(
        private readonly productRatingRepository: ProductRatingRepository
    ){}

    async rateProduct(userId:string, productId:string, ratingValue:number):Promise<Rating>{
        return await this.productRatingRepository.rateProduct(userId, productId, ratingValue)
    }

    async updateAverageRating(productId:string):Promise<string>{
        const rated = await this.productRatingRepository.updateAverageRating(productId)

        if (!rated) throw new NotFoundException(`No se calificó correctamente el producto. ID: ${productId}`)

        return `Se calificó correctamente el proyecto. ID: ${productId}`
    }
}
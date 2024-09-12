import { Body, Controller, Post } from '@nestjs/common';
import { ProductRatingService } from './product-rating.service';

@Controller('product-rating')
export class ProductRatingController {
    constructor(
        private readonly rateProductService: ProductRatingService
    ){}

    @Post()
    async rateProduct(
        @Body('productId') productId:string,
        @Body('userId') userId:string,
        @Body('rating') rating:number,
    ){
        return await this.rateProductService.rateProduct(userId, productId, rating)
    }
}

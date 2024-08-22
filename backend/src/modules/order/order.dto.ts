import { Optional } from "@nestjs/common";
import { Type } from "class-transformer";
import { 
    ArrayMinSize, 
    ArrayNotEmpty, 
    IsArray, 
    IsBoolean, 
    IsDate, 
    IsInt, 
    IsNotEmpty, 
    IsNumber, 
    IsOptional, 
    IsString, 
    IsUUID, 
    ValidateNested 
} from "class-validator";
import { OrderDetail } from "src/entities/orderdetail.entity";
import { ProductsOrder } from "src/entities/product-order.entity";
import { User } from "src/entities/user.entity";

export class ProductInfo {
    @IsUUID()
    id: string;

    @IsInt()
    @IsNotEmpty()
    quantity: number;
}

export class AddOrderDto {
    @IsUUID()
    userId: string;

    @IsString()
    @IsNotEmpty()
    address: string | 'Retira en local';

    @IsNumber()
    @Optional()
    discount?: number;

    @Type(() => Date)
    @IsDate()
    @Optional()
    deliveryDate?: Date;
    
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => ProductInfo)
    products: ProductInfo[];
}
export class FinalOrderDto {
    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    date:Date
    

    @IsNotEmpty()
    user: User
    
    @IsString()
    @IsNotEmpty()
    status:string
    
    @IsBoolean()
    @IsNotEmpty()
    isDeleted:boolean
    
    @IsArray()
    @IsNotEmpty()
    productsOrder:ProductsOrder[]
    

    @IsNotEmpty()
    orderDetail:OrderDetail
    
    @IsNumber()
    @IsNotEmpty()
    finalPrice: number
}

export class UpdateOrderDto {
    @IsUUID()
    @IsOptional()
    userId?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsNumber()
    @IsOptional()
    discount?: number;

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    deliveryDate?: Date;

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ProductInfo)
    products?: ProductInfo[];
}

export class ProductOrderResponseDto {
    @IsUUID()
    id: string;

    @IsInt()
    quantity: number;

    @IsUUID()
    productId: string;
}

export class OrderResponseDto {
    @IsUUID()
    id: string;

    @IsString()
    address: string;

    @IsNumber()
    discount: number;

    @Type(() => Date)
    @IsDate()
    deliveryDate: Date;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductOrderResponseDto)
    productsOrder: ProductOrderResponseDto[];
}

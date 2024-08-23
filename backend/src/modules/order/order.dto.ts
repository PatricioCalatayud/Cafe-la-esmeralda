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
    @IsOptional()
    address?: string | 'Retira en local';
    
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => ProductInfo)
    products: ProductInfo[];

    @IsBoolean()
    @IsOptional()
    account?: boolean;
}

export class UpdateOrderDto {
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    deliveryDate?: Date;

    @IsString()
    status: string;
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
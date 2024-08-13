import { Type } from "class-transformer"
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from "class-validator"

export class CreateProductDto{
    @IsNotEmpty()
    @Type(() => Number)
    @IsPositive()
    @IsNumber()
    article_id: number;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @Type(() => Number)
    @IsPositive()
    price?: number; 

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    @IsPositive()
    @IsInt()
    stock?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    discount?: number;

    @IsOptional()
    @IsBoolean()
    isAvailable?: boolean;

    @IsNotEmpty()
    @IsUUID() 
    categoryID: string;
}

export class UpdatedProductDto {
    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    price?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @IsPositive()
    @IsInt()
    stock?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    discount?: number;

    @IsOptional()
    @IsBoolean()
    isAvailable?: boolean;

    @IsOptional()
    @IsString() 
    categoryID?: string;
}
import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, ValidateNested, IsArray } from "class-validator";
import { SubproductDto } from "./subproduct.dto"; 

export class CreateProductDto {
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
    @IsNumber()
    @Type(() => Number)
    @IsPositive()
    @IsInt()
    stock: number; 

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

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => SubproductDto)
    @IsArray()
    subproducts?: SubproductDto[];
}

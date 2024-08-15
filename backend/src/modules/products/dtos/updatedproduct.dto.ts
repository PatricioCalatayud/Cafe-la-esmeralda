
import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsNumber, IsOptional, IsPositive, IsString, IsUUID, ValidateNested, IsArray } from "class-validator";
import { SubproductDto } from "./subproduct.dto"; 

export class UpdatedProductDto {
    @IsOptional()
    @IsString()
    description?: string;

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
    @IsUUID()
    categoryID?: string;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => SubproductDto)
    @IsArray()
    subproducts?: SubproductDto[];
}

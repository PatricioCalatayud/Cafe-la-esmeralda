import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, ValidateNested, IsArray } from "class-validator";
import { SubproductDto } from "./subproduct.dto"; 
import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDto {
    @ApiProperty({ description: 'Descripción.' })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ description: 'Stock.' })
    @IsNotEmpty()
    @Type(() => Number)
    @IsPositive()
    @IsNumber()
    @Type(() => Number)
    @IsPositive()
    @IsInt()
    stock: number; 

    @ApiProperty({ description: 'Descuento.' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    discount?: number;

    @ApiProperty({ description: 'Disponibilidad.' })
    @IsOptional()
    @IsBoolean()
    isAvailable?: boolean;

    @ApiProperty({ description: 'ID de la categoría.' })
    @IsNotEmpty()
    @IsUUID()
    categoryID: string;

    @ApiProperty({ description: 'Array de subproductos.' })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => SubproductDto)
    @IsArray()
    subproducts?: SubproductDto[];
}

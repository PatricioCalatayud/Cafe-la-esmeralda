
import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsNumber, IsOptional, IsPositive, IsString, IsUUID, ValidateNested, IsArray } from "class-validator";
import { SubproductDto } from "./subproduct.dto"; 
import { ApiProperty } from "@nestjs/swagger";

export class UpdatedProductDto {
    @ApiProperty({ description: 'Descripción.' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'Precio.' })
    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    price?: number;

    @ApiProperty({ description: 'Stock.' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @IsPositive()
    @IsInt()
    stock?: number;

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
    @IsOptional()
    @IsUUID()
    categoryID?: string;

    @ApiProperty({ description: 'Array de subproductos.' })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => SubproductDto)
    @IsArray()
    subproducts?: SubproductDto[];
}

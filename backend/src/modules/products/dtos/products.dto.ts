import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested, IsArray, IsEnum, IsPositive, IsNumber } from "class-validator";
import { SubproductDto, UpdatedSubproductDto } from "./subproduct.dto"; 
import { ApiProperty } from "@nestjs/swagger";
import { Presentacion } from "src/enum/presentacion.enum";
import { TipoGrano } from "src/enum/tipoGrano.enum";

export class CreateProductDto {
    @ApiProperty({ description: 'Descripción.' })
    @IsNotEmpty()
    @IsString()
    description: string;

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

    @ApiProperty({ description: 'Peso.' })
    @IsNotEmpty()
    @IsEnum(Presentacion)
    presentacion: Presentacion;
    
    @ApiProperty({ description: 'Tipo de grano.' })
    @IsOptional()
    @IsEnum(TipoGrano)
    tipoGrano?: TipoGrano;


    @ApiProperty({ description: 'Array de subproductos.' })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => SubproductDto)
    @IsArray()
    subproducts?: SubproductDto[];
}
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
    @Type(() => UpdatedProductDto)
    @IsArray()
    subproducts?: UpdatedSubproductDto[];
}


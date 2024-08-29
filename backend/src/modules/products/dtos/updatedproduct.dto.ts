
import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsNumber, IsOptional, IsPositive, IsString, IsUUID, ValidateNested, IsArray, IsEnum } from "class-validator";
import { SubproductDto } from "./subproduct.dto"; 
import { ApiProperty } from "@nestjs/swagger";
import { Medida } from "src/enum/medidas.enum";
import { Presentacion } from "src/enum/presentacion.enum";
import { TipoGrano } from "src/enum/tipoGrano.enum";

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

    
    @IsOptional()
    @IsEnum(Presentacion)
    presentacion?: Presentacion;

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


export class UpdatedSubproductDto {
    @IsOptional()
    @IsUUID()
    id?: string;

    @IsOptional()
    @IsInt()
    price?: number;

    @IsOptional()
    @IsInt()
    stock?: number;

    @IsOptional()
    @IsInt()
    amount?: number;

    @IsOptional()
    @IsEnum(Medida)
    unit?: Medida;

    @IsOptional()
    @IsInt()
    discount?: number;


    @IsOptional()
    @IsBoolean()
    isAvailable?: boolean;
}

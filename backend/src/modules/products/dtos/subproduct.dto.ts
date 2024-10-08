import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsInt,  IsNotEmpty, IsNumber,  IsOptional,  IsPositive, IsString } from "class-validator";
import { Medida } from "src/enum/medidas.enum";

export class SubproductDto {


    @ApiProperty({ description: 'Precio.' })
    @IsNotEmpty()
    @Type(() => Number)
    @IsPositive()
    @IsNumber()
    price: number;

    @ApiProperty({ description: 'Stock.' })
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    @IsPositive()
    stock: number;

    @ApiProperty({ description: 'Cantidad.' })
    @IsNotEmpty()
    @Type(() => Number)
    @IsPositive()
    @IsNumber()
    amount: number;
    
    @IsNotEmpty()
    @IsEnum(Medida)
    unit: Medida;

    @IsOptional()
    @IsBoolean()
    isAvailable?: boolean;
}
export class UpdatedSubproductDto {
    @IsOptional()
    @IsString()
    id?:string;

    @ApiProperty({ description: 'Precio.' })
    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    @IsNumber()
    price?: number;

    @ApiProperty({ description: 'Stock.' })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @IsPositive()
    stock?: number;

    @ApiProperty({ description: 'Cantidad.' })
    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    @IsNumber()
    amount?: number;
    
    @IsOptional()
    @IsEnum(Medida)
    unit?: Medida;

    @IsOptional()
    @IsBoolean()
    isAvailable?: boolean;
}

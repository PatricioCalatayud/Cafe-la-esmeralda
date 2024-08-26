import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsInt,  IsNotEmpty, IsNumber,  IsOptional,  IsPositive } from "class-validator";
import { Medida } from "src/enum/medidas.enum";
import { Presentacion } from "src/enum/presentacion.enum";
import { TipoGrano } from "src/enum/tipoGrano.enum";

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

    @IsNotEmpty()
    @IsEnum(Presentacion)
    presentacion: Presentacion;
    
    @IsOptional()
    @IsEnum(TipoGrano)
    tipoGrano?: TipoGrano;

}

import { Presentacion } from "src/enum/presentacion.enum";
import { CreateProductDto } from "./products.dto";
import { UpdatedProductDto } from "./updatedproduct.dto";
import { TipoGrano } from "src/enum/tipoGrano.enum";
import { Medida } from "src/enum/medidas.enum";
import { IsEnum, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCoffeeDto extends CreateProductDto {
    @ApiProperty({ description: 'Presentación del café.' })
    @IsEnum(Presentacion)
    presentacion: Presentacion;
    
    @ApiProperty({ description: 'Tipo de grano.' })
    @IsEnum(TipoGrano)
    tipoGrano: TipoGrano;
    
    @ApiProperty({ description: 'Medida del producto.' })
    @IsEnum(Medida)
    medida: Medida;
}

export class UpdateCoffeeDto extends UpdatedProductDto{
    @ApiProperty({ description: 'Presentación del café.' })
    @IsOptional()
    @IsEnum(Presentacion)
    presentacion?: Presentacion;
    
    @ApiProperty({ description: 'Tipo de grano.' })
    @IsOptional()
    @IsEnum(TipoGrano)
    tipoGrano?: TipoGrano;
    
    @ApiProperty({ description: 'Medida del producto.' })
    @IsOptional()
    @IsEnum(Medida)
    medida?: Medida;
}

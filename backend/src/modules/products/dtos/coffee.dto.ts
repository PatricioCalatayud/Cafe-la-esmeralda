import { Presentacion } from "src/enum/presentacion.enum";
import { CreateProductDto } from "./products.dto";
import { UpdatedProductDto } from "./updatedproduct.dto";
import { TipoGrano } from "src/enum/tipoGrano.enum";
import { Medida } from "src/enum/medidas.enum";
import { IsEnum, IsOptional } from "class-validator";

export class CreateCoffeeDto extends CreateProductDto{
    @IsEnum(Presentacion)
    presentacion: Presentacion;

    @IsEnum(TipoGrano)
    tipoGrano: TipoGrano;

    @IsEnum(Medida)
    medida: Medida;
}

export class UpdateCoffeDto extends UpdatedProductDto{
    @IsOptional()
    @IsEnum(Presentacion)
    presentacion: Presentacion;

    @IsOptional()
    @IsEnum(TipoGrano)
    tipoGrano: TipoGrano;

    @IsOptional()
    @IsEnum(Medida)
    medida: Medida;
}
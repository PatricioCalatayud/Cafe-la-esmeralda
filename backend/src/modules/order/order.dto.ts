import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { 
    ArrayMinSize, 
    ArrayNotEmpty, 
    IsArray, 
    IsBoolean, 
    IsDate, 
    IsInt, 
    IsNotEmpty, 
    IsNumber, 
    IsOptional, 
    IsString, 
    IsUUID, 
    ValidateNested 
} from "class-validator";

export class ProductInfo {
    @ApiProperty({ description: 'ID del producto.' })
    @IsUUID()
    id: string;

    @ApiProperty({ description: 'Cantidad de productos de la orden.'})
    @IsInt()
    @IsNotEmpty()
    quantity: number;
}

export class AddOrderDto {
    @ApiProperty({ description: 'ID del usuario.' })
    @IsUUID()
    userId: string;

    @ApiProperty({ description: 'Dirección de envío.' })
    @IsString()
    @IsOptional()
    address?: string | 'Retira en local';
    
    @ApiProperty({ description: 'Array de productos.' })
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => ProductInfo)
    products: ProductInfo[];

    @ApiProperty({ description: 'Propiedad para cuentas corrientes, en caso de ser true la orden se pone "En preparación".' })
    @IsBoolean()
    @IsOptional()
    account?: boolean;
}

export class UpdateOrderDto {
    @ApiProperty({ description: 'Fecha de envío.' })
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    deliveryDate?: Date;

    @ApiProperty({ description: 'Estado del tracking.' })
    @IsString()
    status: string;
}
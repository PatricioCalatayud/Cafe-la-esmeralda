import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { 
    ArrayMinSize, 
    ArrayNotEmpty, 
    IsArray, 
    IsBoolean, 
    IsDate, 
    IsEnum, 
    IsInt, 
    IsNotEmpty, 
    IsOptional, 
    IsString, 
    IsUUID, 
    ValidateNested 
} from "class-validator";

export class ProductInfo {
    @ApiProperty({ description: 'ID del producto.' })
    @IsUUID()
    @IsNotEmpty()
    productId: string;

    @ApiProperty({ description: 'Cantidad de subproductos de la orden.' })
    @IsInt()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({ description: 'ID del subproducto (opcional).' })
    @IsUUID()
    @IsNotEmpty()
    subproductId: string;
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
    @IsEnum(['Cuenta corriente', 'Transferencia'])
    @IsOptional() 
    account?: 'Cuenta corriente' | 'Transferencia' | null;
}

export class UpdateOrderDto {
    @ApiProperty({ description: 'Fecha de envío.' })
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    deliveryDate?: Date;

    @ApiProperty({ description: 'Estado del tracking.' })
    @IsString()
    @IsOptional()
    status?: string;

    @ApiProperty({ description: 'Estado de la orden.' })
    @IsBoolean()
    @IsOptional()
    orderStatus?: boolean;

    @ApiProperty({ description: 'Estado de la transferencia.' })
    @IsString()
    @IsOptional()
    transferStatus?: string;
}

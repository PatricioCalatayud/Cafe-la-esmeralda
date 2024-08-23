import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber,  IsPositive, IsString } from "class-validator";

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

    @ApiProperty({ description: 'Peso.' })
    @IsNotEmpty()
    @IsString()
    unit: string; 
}

import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber,  IsPositive, IsString } from "class-validator";

export class SubproductDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsPositive()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    @IsPositive()
    stock: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsPositive()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsString()
    unit: string; 
}

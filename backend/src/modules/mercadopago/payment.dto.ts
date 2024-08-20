import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class PaymentDto {
    @IsNotEmpty()
    @IsUUID()
    orderId: string;
    
    @IsNotEmpty()
    @IsNumber()
    price: number;
}
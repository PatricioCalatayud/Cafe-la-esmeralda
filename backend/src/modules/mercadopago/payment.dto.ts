import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class PaymentDto {
    @ApiProperty({ description: 'ID de la orden asociada al pago.' })
    @IsNotEmpty()
    @IsUUID()
    orderId: string;
    
    @ApiProperty({ description: 'Monto del pago.' })
    @IsNotEmpty()
    @IsNumber()
    price: number;
}
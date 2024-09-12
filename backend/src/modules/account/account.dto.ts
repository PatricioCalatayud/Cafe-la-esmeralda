import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsUUID } from "class-validator";

export class AccountPaymentDto {
    @ApiProperty({ description: 'ID de la cuenta del pago.'})
    @IsUUID()
    @IsNotEmpty()
    accountId: string;

    @ApiProperty({ description: 'Importe pagado por el cliente.' })
    @IsInt()
    @IsNotEmpty()
    amount: number;
}
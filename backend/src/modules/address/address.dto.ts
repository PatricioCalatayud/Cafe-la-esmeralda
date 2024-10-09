import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class AddressDTO {
  @ApiProperty({ description: 'Provincia.', example: 'Buenos Aires' })
  @IsNotEmpty()
  @IsNumber()
  province: number;

  @ApiProperty({ description: 'Localidad (Ciudad).' })
  @IsString()
  @IsNotEmpty()
  localidad: string;

  @ApiProperty({ description: 'Número de entrega.' })
  @IsNumber()
  @IsOptional()
  deliveryNumber?: number;

  @ApiProperty({ description: 'Dirección postal.' })
  @IsString()
  @IsNotEmpty()
  address: string;
}
export class UpdateAddressDTO {
  @ApiProperty({ description: 'Provincias.(opt)', example: 'Buenos Aires' })
  @IsOptional()
  @IsNumber()
  province?: number;

  @ApiProperty({ description: 'Localidad (Ciudad).(opt)', example: 'Chivilcoy' })
  @IsString()
  @IsOptional()
  localidad?: string;

  @ApiProperty({ description: 'Número de entrega.(opt)', example: '123' })
  @IsNumber()
  @IsOptional()
  deliveryNumber?: number;

  @ApiProperty({ description: 'Dirección postal.(opt)', example: 'Calle falsa 123' })
  @IsString()
  @IsOptional()
  address?: string;
}

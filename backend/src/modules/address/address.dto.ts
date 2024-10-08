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
  @ApiProperty({ description: 'Provincias.', example: 'Buenos Aires' })
  @IsOptional()
  @IsNumber()
  province?: number;

  @ApiProperty({ description: 'Localidad (Ciudad).', example: 'Chivilcoy' })
  @IsString()
  @IsOptional()
  localidad?: string;

  @ApiProperty({ description: 'Número de entrega.', example: '123' })
  @IsNumber()
  @IsOptional()
  deliveryNumber?: number;

  @ApiProperty({ description: 'Dirección postal.', example: 'Calle falsa 123' })
  @IsString()
  @IsOptional()
  address?: string;
}

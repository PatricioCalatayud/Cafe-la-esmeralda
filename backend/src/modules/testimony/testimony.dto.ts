import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';

export class CreateTestimonyDto {
  @ApiProperty({ description: 'ID del usuario.' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Descripción.' })
  @IsString()
  description: string;
  
  @ApiProperty({ description: 'Puntuación.' })
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  punctuation: number;
}

export class CreateTestimonyEntityDto {
  @ApiProperty({ description: 'Descripción.' })
  @IsString()
  description:string

  @ApiProperty({ description: 'Puntuación.' })
  @IsNumber()
  @Type(()=> Number)
  @IsPositive()
  punctuation: number;
}
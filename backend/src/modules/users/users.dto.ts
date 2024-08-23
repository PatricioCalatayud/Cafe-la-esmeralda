import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { Role } from "src/enum/roles.enum";

export class UserDTO {
    @ApiProperty({ description: 'Nombre.' })
    @IsOptional()
    name: string;

    @ApiProperty({ description: 'Email.' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Rol.' })
    @IsOptional()
    @IsEnum(Role, { each: true })
    role: Role;

    @ApiProperty({ description: 'Contraseña.' })
    @IsOptional()
    password?: string;

    @ApiProperty({ description: 'Número de celular.' })
    @IsOptional()
    phone?: string;
}

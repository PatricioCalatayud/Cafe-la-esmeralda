import { ApiProperty, PickType } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Role } from "src/enum/roles.enum";

export class UserDTO {
    @ApiProperty({ description: 'Nombre.' })
    @IsOptional()
    name: string;

    @ApiProperty({ description: 'Email.' })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @Transform(({ value }) => value.toLowerCase())
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

export class LoginUserDto extends PickType(UserDTO, ['email', 'password']) {}

export class Email extends PickType(UserDTO, ['email']) {}

export class UpdateUserDTO {
    @ApiProperty({ description: 'Email.' })
    @IsString()
    @IsOptional()
    @IsEmail()
    @Transform(({ value }) => value.toLowerCase())
    email?: string;

    @ApiProperty({ description: 'Rol.' })
    @IsOptional()
    @IsEnum(Role, { each: true })
    role?: Role;

    @ApiProperty({ description: 'Límite para cuentas corrientes de clientes.' })
    @IsOptional()
    @IsNumber()
    accountLimit: number;

    @ApiProperty({ description: 'Contraseña.' })
    @IsOptional()
    password?: string;

    @ApiProperty({ description: 'Número de celular.' })
    @IsOptional()
    phone?: string;
}
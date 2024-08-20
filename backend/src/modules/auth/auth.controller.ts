import { BadRequestException, Body, Controller, Post, Put } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';
import { UserDTO } from 'src/modules/users/users.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @ApiOperation({ 
        summary: 'Registro de usuario.',
        description: 
            'Este endpoint registra un usuario.'
    })
    @Post('signup')
    async signUp(@Body() userDTO: UserDTO): Promise<User> {
        return await this.authService.signUp(userDTO);
    }
    
    @ApiOperation({ 
        summary: 'Inicio de sesión.',
        description: 
            'Este endpoint inicia la sesión del usuario. El usuario debe estar registrado.' 
    })
    @Post('signin')
    async signIn(
        @Body('email') email: string,
        @Body('password') password: string,
    ) {
        return await this.authService.signIn(email, password);
    }

    @ApiOperation({
        summary: 'Restablecimiento de contraseña.',
        description: 'Este endpoint envía un correo a un usuario para restablecer la contraseña.'
    })
    @Post('reset-password')
    async resetPassword(@Body('email') email: string) {
        if (!email) throw new BadRequestException('El email es requerido.')
        return await this.authService.resetPassword(email);
    }

    @ApiOperation({
        summary: 'Restablecimiento de contraseña.',
        description: 'Este endpoint actualiza la contraseña del usuario que solicitó restablecerla.'
    })
    @Put('update-password')
    async updatePassword(@Body() data) {
        return await this.authService.updatePassword(data.token, data.password);
    }
}

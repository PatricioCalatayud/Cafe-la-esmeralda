import { BadRequestException, Body, Controller, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';
import { Email, LoginUserDto, UserDTO } from 'src/modules/users/users.dto';
import { AuthService } from './auth.service';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @ApiOperation({ 
        summary: 'Registro de usuario',
        description: 
            'Este endpoint registra un usuario.'
    })
    @Post('signup')
    async signUp(@Body() userDTO: UserDTO): Promise<User> {
        return await this.authService.signUp(userDTO);
    }
    
    @ApiOperation({ 
        summary: 'Inicio de sesión',
        description: 
            'Este endpoint inicia la sesión del usuario. El usuario debe estar registrado.' 
    })
    @Post('signin')
    async signIn(@Body() user: LoginUserDto) {
        return await this.authService.signIn(user.email, user.password);
    }

    @ApiOperation({
        summary: 'Restablecimiento de contraseña',
        description: 'Este endpoint envía un correo a un usuario para restablecer la contraseña.'
    })
    @Post('reset-password')
    async resetPassword(@Body() email: Email) {
        return await this.authService.resetPassword(email.email);
    }

    @ApiOperation({
        summary: 'Restablecimiento de contraseña',
        description: 'Este endpoint actualiza la contraseña del usuario que solicitó restablecerla.'
    })
    @Put('update-password')
    async updatePassword(@Body() data) {
        return await this.authService.updatePassword(data.token, data.password);
    }
}

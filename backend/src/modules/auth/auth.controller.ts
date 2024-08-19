import { Body, Controller, Post } from '@nestjs/common';
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
}

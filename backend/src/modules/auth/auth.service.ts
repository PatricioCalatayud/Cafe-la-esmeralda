import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UserDTO } from '../users/users.dto';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/enum/roles.enum';
import { config as dotenvConfig } from 'dotenv';
import { MailerService } from '../mailer/mailer.service';
import { AuthRepository } from './auth.repository';
dotenvConfig({ path: '.env.development'});

@Injectable()
export class AuthService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly mailerService: MailerService
    ) {}

    async signUp(userDTO: UserDTO): Promise<User> {
        return this.authRepository.signUp(userDTO);
    }
    
    async signIn(email: string, password: string) {
        return this.authRepository.signIn(email, password);
    }
    
    async resetPassword(email: string) {
        const token = await this.authRepository.getToken(email);

        const link = `${process.env.BASE}/resetPassword?token=${token}`;

        return await this.mailerService.sendEmailPassword(email, link);
    }

    async updatePassword(token: string, password: string) {
        await this.authRepository.updatePassword(token, password);

        return { HttpCode: 200, message: 'Contraseña actualizada correctamente.' }
    }
}
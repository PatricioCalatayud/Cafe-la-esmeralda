import { BadRequestException, ConflictException, HttpCode, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from '../users/users.dto';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/enum/roles.enum';
import { config as dotenvConfig } from 'dotenv';
import { MailerService } from '../mailer/mailer.service';
dotenvConfig({ path: '.env.development'});

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService
    ) {}

    async signUp(userDTO: UserDTO): Promise<User> {
        const { email, password } = userDTO;

        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) throw new ConflictException('El usuario ya existe.');

        let newUser: User;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            if (!hashedPassword) throw new BadRequestException('Error encriptando contraseña.');
            newUser = await this.userRepository.create({...userDTO, password: hashedPassword});
        } else {
            newUser = await this.userRepository.create(userDTO);
        }

        newUser.role = Role.USER;

        return await this.userRepository.save(newUser);
    }
    
    async signIn(email: string, password: string) {
        const user = await this.userRepository.findOneBy({ email });
        if (!user) throw new NotFoundException('Credenciales invalidas.');
        let userRoles: Role[] = [user.role];
    
        if (!password) {
            const payload = {
                name: user.name, 
                email: user.email,
                phone: user.phone, 
                sub: user.id,
                roles: userRoles
            };
    
            const accessToken = this.jwtService.sign(payload);
    
            return { success: 'Login exitoso.', accessToken };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new BadRequestException('Credenciales invalidas.');
    
        const payload = { 
            name: user.name,
            email: user.email,
            phone: user.phone, 
            sub: user.id, 
            roles: userRoles,
            isAvailable: user.isAvailable,
        }
        
        const accessToken = this.jwtService.sign(payload);
    
        return { success : 'Login exitoso.', accessToken };
    }
    
    async resetPassword(email: string) {
        const user = await this.userRepository.findOneBy({ email });
        if (!user) throw new NotFoundException('Correo no registrado.');

        const token = this.jwtService.sign({ userId: user.id });

        const link = `${process.env.BASE}/resetPassword?token=${token}`;

        return await this.mailerService.sendEmailPassword(email, link);
    }

    async updatePassword(token, password: string) {
        const decodedToken = await this.jwtService.verify(token);
        const user = await this.userRepository.findOneBy({ id: decodedToken.userId });
        if (!user) throw new NotFoundException('Usuario no encontrado.');

        user.password = await bcrypt.hash(password, 10);
        await this.userRepository.save(user);

        return { HttpCode: 200, message: 'Contraseña actualizada correctamente.' }
    }
}
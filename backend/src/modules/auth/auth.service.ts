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
        if (existingUser) throw new ConflictException('El usuario ya existe');

        let newUser: User;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            if (!hashedPassword) throw new BadRequestException('Error hashing password');
            newUser = await this.userRepository.create({...userDTO, password: hashedPassword});
        } else {
            newUser = await this.userRepository.create(userDTO);
        }

        newUser.role = Role.USER;

        return await this.userRepository.save(newUser);
    }
    
    async signIn(email: string, password: string) {
        const user = await this.userRepository.findOneBy({ email });
        if (!user) throw new NotFoundException('Invalid credentials');
        let userRoles: Role[] = [user.role];
    
        if (!user.password) {
            const payload = {
                name: user.name, 
                email: user.email,
                phone: user.phone, 
                sub: user.id,
                roles: userRoles,
                isAvailable: user.isAvailable,
            };
    
            const accessToken = this.jwtService.sign(payload);
    
            return { success: 'External user logged in successfully', accessToken };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new BadRequestException('Invalid credentials');
    
        const payload = { 
            name: user.name,
            email: user.email,
            phone: user.phone, 
            sub: user.id, 
            roles: userRoles,
            isAvailable: user.isAvailable,
        }
        
        const accessToken = this.jwtService.sign(payload);
    
        return { success : 'User logged in successfully', accessToken };
    }
    
    async resetPassword(email: string) {
        const user = await this.userRepository.findOneBy({ email });
        if (!user) throw new NotFoundException('Correo no registrado.');

        const token = this.jwtService.sign({ userId: user.id });

        const link = `${process.env.BASE}/resetPassword?token=${token}`;

        return await this.mailerService.sendEmailPassword(email, 'Recuperación de Contraseña', link);
    }

    async updatePassword(token, password: string) {
        const decodedToken = await this.jwtService.verify(token);
        const user = await this.userRepository.findOneBy({ id: decodedToken.userId });
        if (!user) throw new NotFoundException('Usuario no encontrado.');

        user.password = await bcrypt.hash(password, 10);
        await this.userRepository.save(user);

        return { HttpCode: 201, message: 'Contraseña actualizada correctamente.' }
    }
}
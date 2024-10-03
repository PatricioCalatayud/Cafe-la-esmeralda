import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { UserDTO } from "../users/users.dto";
import { Role } from "src/enum/roles.enum";
import { Address } from "src/entities/address.entity";

@Injectable()
export class AuthRepository {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(Address) private addressRepository: Repository<Address>,
        private readonly jwtService: JwtService,
    ) {}

    async signUp(userDTO: UserDTO): Promise<User> {
        const { email, password, address } = userDTO;

        const existingUser = await this.usersRepository.findOne({ where: { email } });
        if (existingUser) throw new ConflictException('El usuario ya existe.');

        let newUser: User;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            if (!hashedPassword) throw new BadRequestException('Error encriptando contraseña.');
            newUser = await this.usersRepository.create({...userDTO, password: hashedPassword});
        } else {
            newUser = await this.usersRepository.create(userDTO);
        }

        newUser.role = Role.USER;

        if (address) {
            const newAddress = this.addressRepository.create(address); // Crea la dirección
            await this.addressRepository.save(newAddress); // Guarda la dirección
            newUser.address = newAddress; // Asigna la dirección al usuario
        }

        return await this.usersRepository.save(newUser);
    }

    async signIn(email: string, password: string) {
        const user = await this.usersRepository.findOne({ where: { email } });
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
            roles: userRoles
        }
        
        const accessToken = this.jwtService.sign(payload);
    
        return { success : 'Login exitoso.', accessToken };
    }

    async getToken(email: string) {
        const user = await this.usersRepository.findOneBy({ email });
        if (!user) throw new NotFoundException('Correo no registrado.');

        return this.jwtService.sign({ userId: user.id });
    }

    async updatePassword(token: string, password: string) {
        const decodedToken = await this.jwtService.verify(token);
        const user = await this.usersRepository.findOneBy({ id: decodedToken.userId });
        if (!user) throw new NotFoundException('Usuario no encontrado.');

        user.password = await bcrypt.hash(password, 10);
        await this.usersRepository.save(user);
    }
}
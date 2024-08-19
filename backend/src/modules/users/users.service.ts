import { Injectable, NotFoundException, ConflictException, BadRequestException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/enum/roles.enum';
import { UserDTO } from './users.dto';
import { timeStamp } from 'console';

@Injectable()
export class UsersService {
    constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    ) {}

    async getUserById(id: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { id } });
    }

    async updateUser(id: string, userDTO: Partial<UserDTO>): Promise<User | undefined> {
    await this.userRepository.update(id, userDTO);
    return await this.userRepository.findOne({ where: { id } });
    }

    async deleteUser(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
    }
}

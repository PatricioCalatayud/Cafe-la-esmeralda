import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './users.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

    async getUsers(page: number = 1, limit: number = 10): Promise<Partial<Omit<User, "password">[]>> {
        const skip = (page - 1) * limit;
      
        const users = await this.userRepository.find({
            skip,
            take: limit,
        });
      
        return users.map((user) => {
            delete user.password;
            return user;
        })
    }

    async getUserById(id: string): Promise<User | undefined> {
        return await this.userRepository.findOne({ where: { id } });
    }

    async updateUser(id: string, userDTO: Partial<UserDTO>): Promise<User | undefined> {
        await this.userRepository.update(id, userDTO);
        return await this.userRepository.findOne({ where: { id } });
    }

    async deleteUser(id: string) {
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }

        return { HttpCode: 200 };
    }
}

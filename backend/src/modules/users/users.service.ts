import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './users.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

    async getUsers(page: number, limit: number): Promise<{ data: Omit<User, "password">[], total: number }> {
        const [data, total] = await this.userRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit
        });
        
        data.map((user) => {
            delete user.password;
            return user;
        })

        return { data, total };
    }

    async getUserById(id: string): Promise<Omit<User, "password"> | undefined> {
        const user = await this.userRepository.findOne({ where: { id } });
        delete user.password;

        return user;
    }

    async updateUser(id: string, userDTO: Partial<UserDTO>): Promise<Omit<User, "password"> | undefined> {
        await this.userRepository.update(id, userDTO);

        const updatedUser = await this.userRepository.findOne({ where: { id } });
        delete updatedUser.password;

        return updatedUser;
    }

    async deleteUser(id: string) {
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }

        return { HttpCode: 200 };
    }
}

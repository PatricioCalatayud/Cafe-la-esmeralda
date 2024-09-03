import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDTO, UserDTO } from './users.dto';
import { Account } from 'src/entities/account.entity';
import { Role } from 'src/enum/roles.enum';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Account) private accountRepository: Repository<Account>
    ) {}

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

    async getUserById(id: string): Promise<Omit<User, "password">> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new BadRequestException(`Usuario no encontrado. ID: ${id}`);
        
        delete user.password;
        return user;
    }

    async updateUser(id: string, userDTO: Partial<UpdateUserDTO>): Promise<Omit<User, "password">> {
        await this.userRepository.update(id, userDTO);

        const updatedUser = await this.userRepository.findOne({ where: { id }});
        if (!updatedUser) throw new BadRequestException(`Usuario no encontrado. ID: ${id}`);
        
        if(userDTO.role === Role.CLIENT && !updatedUser.account) await this.accountRepository.save({ client: updatedUser, creditLimit: userDTO.accountLimit });

        delete updatedUser.password;
        return updatedUser;
    }

    async deleteUser(id: string) {
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);

        return { HttpCode: 200 };
    }
}

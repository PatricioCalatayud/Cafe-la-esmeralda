import {Controller, Post, Body, Get, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/entities/user.entity';
import { UserDTO } from 'src/modules/users/users.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';

@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get(':id')
    @ApiBearerAuth()
    @ApiOperation({
      summary: 'Obtener un usuario por id',
      description:
        'Esta ruta devuelve un usuario registrado, por un id enviado por parametro',
    })
    @UseGuards(AuthGuard)
    async getUserById(@Param('id') id: string): Promise<User | undefined> {
        return await this.usersService.getUserById(id);
    }

    @Put(':id')
    @ApiBearerAuth()
    @ApiOperation({
      summary: 'Actualizar un usuario por id',
      description:
        'Esta ruta actualiza un usuario, por un id enviado por parametro y datos nuevos, de tipo UserDto enviados por body',
    })
    @UseGuards(AuthGuard)
    async updateUser(
        @Param('id') id: string,
        @Body() userDTO: Partial<UserDTO>,
    ): Promise<User | undefined> {
        return await this.usersService.updateUser(id, userDTO);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Eliminar un usuario por id',
        description:
          'Esta ruta elimina un usuario, por un id enviado por parametro',
      })
      @UseGuards(AuthGuard)
    async deleteUser(@Param('id') id: string): Promise<void> {
    return await this.usersService.deleteUser(id);
    }
}

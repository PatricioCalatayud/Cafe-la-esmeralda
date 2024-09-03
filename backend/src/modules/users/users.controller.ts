import {Controller, Body, Get, Param, Put, Delete, UseGuards, Query, DefaultValuePipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/entities/user.entity';
import { UpdateUserDTO, UserDTO } from 'src/modules/users/users.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';

@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async getUsers(
      @Query('page', new DefaultValuePipe(1)) page: number, 
      @Query('limit', new DefaultValuePipe(10)) limit: number
    ): Promise<{ data: Partial<Omit<User, "password">[]>, total: number }> {
        return await this.usersService.getUsers(page, limit);
    }

    @Get(':id')
    @ApiOperation({
      summary: 'Obtiene un usuario por ID',
      description:
        'Esta ruta devuelve un usuario registrado, por un id enviado por parametro',
    })
    async getUserById(@Param('id') id: string): Promise<Omit<User, "password"> | undefined> {
        return await this.usersService.getUserById(id);
    }

    @Put(':id')
    @ApiBearerAuth()
    @ApiOperation({
      summary: 'Actualiza un usuario por ID',
      description:
        'Esta ruta actualiza un usuario, por un id enviado por parametro y datos nuevos, de tipo UserDto enviados por body',
    })
    @UseGuards(AuthGuard)
    async updateUser(
        @Param('id') id: string,
        @Body() userDTO: Partial<UpdateUserDTO>,
    ): Promise<Omit<User, "password"> | undefined> {
        return await this.usersService.updateUser(id, userDTO);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Elimina un usuario por ID',
        description:
          'Esta ruta elimina un usuario, por un id enviado por parametro',
      })
      @UseGuards(AuthGuard)
    async deleteUser(@Param('id') id: string) {
      return await this.usersService.deleteUser(id);
    }
}

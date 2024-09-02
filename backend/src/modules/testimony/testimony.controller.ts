import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TestimonyService } from './testimony.service';
import { CreateTestimonyDto } from './testimony.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';

@ApiTags('Calificaciones')
@Controller('testimony')
export class TestimonyController {
    constructor(private readonly testimonyService:TestimonyService){}
    @Get()
    @ApiOperation({ 
        summary: 'Obtiene calificaciones',
        description: 
            'Este endpoint permite obtener todas las calificaciones. No es necesario el registro'
    })
    async getTestimonials(){
            return await this.testimonyService.getTestimonials()
    }

    @Post()
    @ApiOperation({ 
        summary: 'Crea la calificación.',
        description: 
            'Este endpoint permite crear una calificación.'
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async createTestimony(@Body() testimony: CreateTestimonyDto){
        const { userId, ...testimonyEntity } = testimony
        return this.testimonyService.createTestimony(userId, testimonyEntity)
    }
}
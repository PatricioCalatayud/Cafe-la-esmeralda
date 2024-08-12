import { Body, Controller, Get, Post } from '@nestjs/common';
import { TestimonyService } from './testimony.service';
import { CreateTestimonyDto } from './testimony.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Calificaciones')
@Controller('testimony')
export class TestimonyController {
    constructor(private readonly testimonyService:TestimonyService){}
    @Get()
    @ApiOperation({ 
        summary: 'Obtener calificaciones.',
        description: 
            'Este endpoint permite obtener todas las calificaciones.'
    })
    async getTestimonials(){
            return await this.testimonyService.getTestimonials()
    }

    @Post()
    @ApiOperation({ 
        summary: 'Crear calificación.',
        description: 
            'Este endpoint permite crear una calificación.'
    })
    async createTestimony(@Body() testimony: CreateTestimonyDto){
        const { userId, ...testimonyEntity } = testimony
        return this.testimonyService.createTestimony(userId, testimonyEntity)
    }

}
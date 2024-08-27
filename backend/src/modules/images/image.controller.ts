import { Controller, HttpStatus, ParseFilePipeBuilder, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';

@ApiTags('Image Storage')
@Controller('image')
export class ImageController {
    constructor(private readonly uploadService: ImageService){}

    @ApiOperation({
        summary: 'Almacena imagenes',
        description:
            'Esta ruta permite subir imagenes con los datos enviados por body',
    })
    @UseGuards(AuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile(
        new ParseFilePipeBuilder()
        .addMaxSizeValidator({
            maxSize: 500000,
            message: 'El archivo es muy largo, el tamaño maximo es de 500KB',
        })
        .build({
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        })
    ) file?: Express.Multer.File){
        
        const url = await this.uploadService.uploadFile(file);
        return {url};
    }

}


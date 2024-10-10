import { Body, Controller, HttpStatus, ParseFilePipeBuilder, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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
            maxSize: 10000000,
            message: 'El archivo es muy grande, el tamaño maximo es de 10MB',
        })
        .build({
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        })
    ) file?: Express.Multer.File){
        
        const url = await this.uploadService.uploadFile(file);
        return {url};
    }

    @ApiOperation({
        summary: 'Sube imagen del comprobante de transferencia.',
        description:
            'Esta ruta permite subir imagenes de los comprobantes de transferencia.',
    })
    @Put('transfer')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImageTransfer(@UploadedFile(
        new ParseFilePipeBuilder()
        .addMaxSizeValidator({
            maxSize: 10000000,
            message: 'El archivo es muy grande, el tamaño maximo es de 10MB',
        })
        .build({
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        })
    ) file: Express.Multer.File, @Body('id') id: string){
        return await this.uploadService.uploadImageTransfer(file, id);
    }

    @ApiOperation({ 
        summary: 'Sube imagen del comprobante de factura.',
        description: 'Esta ruta permite subir imagenes de los comprobantes de factura.'
    })
    @Put('bill')
    @UseInterceptors(FileInterceptor('image'))
    async uploadBill(
      @Body() data: { id: string, to: string }, 
      @UploadedFile() file?: Express.Multer.File
    ) {
        return await this.uploadService.uploadImageBill(data.id, data.to, file);
    }
}
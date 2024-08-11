import { Controller, HttpStatus, ParseFilePipeBuilder, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Storage')
@Controller('image')
export class ImageController {
    constructor(private readonly uploadService: ImageService){}

    @Post()
    @ApiOperation({
        summary: 'Añadir imagenes a la base de datos',
        description:
            'Esta ruta permite subir imagenes con los datos enviados por body',
    })
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

// @Controller('Storage')
// export class StorageController {
//   constructor(private readonly storageService: StorageService) {}

//   @Post('upload')
//   @ApiBearerAuth()
//   @ApiOperation({
//     summary: 'Añadir imagenes a la base de datos',
//     description:
//       'Esta ruta permite subir imagenes con los datos enviados por body',
//   })
//   @UseGuards(AuthGuard)
//   @UseInterceptors(FileInterceptor('file'))
//   async uploadImage(@UploadedFile(
//     new ParseFilePipe({
//       validators: [
//         new MaxFileSizeValidator({ maxSize: 3000000, message: 'El archivo debe ser menor a 3mb.' }),
//         new FileTypeValidator({ fileType: /(jpg|jpeg|png|jfif|webp)$/ })
//       ]
//     })
//   ) file: Express.Multer.File): Promise<string> {
//       return await this.storageService.uploadImage(file);
//   }
// }


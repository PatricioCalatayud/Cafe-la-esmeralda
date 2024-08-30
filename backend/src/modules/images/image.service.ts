import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { bucket } from "src/config/firebase.config";
import { Receipt } from "src/entities/receipt.entity";
import { Repository } from "typeorm";
import {v4 as uuidv4} from 'uuid';

@Injectable()
export class ImageService{
    constructor(@InjectRepository(Receipt) private readonly receiptRepository: Repository<Receipt>) {}

    async uploadFile(file?: Express.Multer.File): Promise<string> {
        if(!file) throw new BadRequestException('Debe adjuntar un archivo imagen')
            const fileName = `${uuidv4()}-${file.originalname}`;
        const fileUpload = bucket.file(fileName);
    
        await fileUpload.save(file.buffer, {
            metadata: {
                contentType: file.mimetype,
            },
            public:true
        });
        return fileUpload.publicUrl();
    }

    async uploadImageTransfer(file: Express.Multer.File, id: string) {
        if(!file) throw new BadRequestException('Debe adjuntar un archivo imagen')
            const fileName = `${uuidv4()}-${file.originalname}`;
        const fileUpload = bucket.file(fileName);
    
        await fileUpload.save(file.buffer, {
            metadata: {
                contentType: file.mimetype,
            },
            public:true
        });

        console.log(id)
        const imgUrl = fileUpload.publicUrl();

        await this.receiptRepository.update({ id: id }, { image: imgUrl, status: 'Pendiente de revisión de comprobante' });

        return this.receiptRepository.findOneBy({ id });
    }
}

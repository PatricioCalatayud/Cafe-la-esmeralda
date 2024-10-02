import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { bucket } from "src/config/firebase.config";
import { Receipt } from "src/entities/receipt.entity";
import { Repository } from "typeorm";
import {v4 as uuidv4} from 'uuid';
import { MailerService } from "../mailer/mailer.service";
import { BillService } from "../bill/bill.service";

@Injectable()
export class ImageService{
    constructor(
        @InjectRepository(Receipt) private readonly receiptRepository: Repository<Receipt>,
        private readonly mailerService: MailerService,
        private readonly billService: BillService
    ) {}

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

        const imgUrl = fileUpload.publicUrl();

        await this.receiptRepository.update({ id }, { image: imgUrl, status: 'Pendiente de revisión de comprobante' });

        return this.receiptRepository.findOneBy({ id });
    }

    async uploadImageBill(id: string, to: string, file: Express.Multer.File) {

        
        if (!file) {
            const imgUrl = null;
            return await this.billService.updateBill(id, imgUrl);
        }
        
        const fileName = `${uuidv4()}-${file.originalname}`;
        const fileUpload = bucket.file(fileName);
    
        await fileUpload.save(file.buffer, {
            metadata: {
                contentType: file.mimetype,
            },
            public: true
        });
    
        const imgUrl = fileUpload.publicUrl();
    
        await this.mailerService.sendPaymentBill(to, imgUrl);
    
        return await this.billService.updateBill(id, imgUrl);
    }
    
}

import { Module } from "@nestjs/common";
import { ImageService } from "./image.service";
import { ImageController } from "./image.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Receipt } from "src/entities/receipt.entity";
import { MailerModule } from "../mailer/mailer.module";

@Module({
    imports: [TypeOrmModule.forFeature([Receipt]), MailerModule],
    providers: [ImageService],
    controllers: [ImageController],
    exports: [ImageService]
})
export class ImageModule {}
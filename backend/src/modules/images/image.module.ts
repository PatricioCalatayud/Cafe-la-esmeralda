import { Module } from "@nestjs/common";
import { ImageService } from "./image.service";
import { ImageController } from "./image.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Receipt } from "src/entities/receipt.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Receipt])],
    providers: [ImageService],
    controllers: [ImageController],
    exports: [ImageService]
})
export class ImageModule {}
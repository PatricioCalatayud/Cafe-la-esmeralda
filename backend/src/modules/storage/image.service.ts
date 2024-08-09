import { BadRequestException, Injectable } from "@nestjs/common";
import { bucket } from "src/config/firebase.config";
import {v4 as uuidv4} from 'uuid';

@Injectable()
export class ImageService{
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
// }
// @Injectable()
// export class StorageService {
//   constructor() {}

//   async uploadImage(file: Express.Multer.File): Promise<string> {
//     try {
//       const snapshot = await uploadBytes(ref(storageRef, 'images/' + file.originalname), file.buffer);
//       const url = await getDownloadURL(snapshot.ref);
//       return url;
//     } catch (error) {
//       console.error('Upload failed:', error);
//       throw error;
//     }
//   }
 }
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTestimonyEntityDto } from './testimony.dto';
import { TestimonyRepository } from './testimony.repository';

@Injectable()
export class TestimonyService {

    constructor(
        private readonly testimonyRepository: TestimonyRepository
    ){}

    async getTestimoniesService() {
        return this.testimonyRepository.getTestimonials()
    }

    async createTestimonyService(userID: string, testimony: CreateTestimonyEntityDto) {
        if (!userID) throw new BadRequestException('User es obligatorio');
        if(!testimony) throw new BadRequestException('Testimony es obligatorio');
        return this.testimonyRepository.createTestimony(userID, testimony)
    }
}



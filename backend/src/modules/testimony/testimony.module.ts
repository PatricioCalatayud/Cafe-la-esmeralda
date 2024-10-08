import { Module } from '@nestjs/common';
import { TestimonyController } from './testimony.controller';
import { TestimonyService } from './testimony.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Testimony } from 'src/entities/testimony.entity';
import { TestimonyRepository } from './testimony.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Testimony])],
  controllers:[TestimonyController],
  providers: [TestimonyService, TestimonyRepository]
})
export class TestimonyModule {}

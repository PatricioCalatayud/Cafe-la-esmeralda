import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from 'src/entities/address.entity';
import { AddressRepository } from './address.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Address])],
  providers: [AddressService, AddressRepository],
  controllers: [AddressController]
})
export class AddressModule {}

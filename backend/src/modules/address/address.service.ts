import { Injectable } from '@nestjs/common';
import { AddressRepository } from './address.repository';

@Injectable()
export class AddressService {
    constructor(
        private readonly addressRepository: AddressRepository
    ) {}
    async updateAddressService(id: string, province:number, localidad: string, deliveryNumber: number, address: string) {
        return this.addressRepository.updateAddressRepository(id, province, localidad, deliveryNumber, address);
    }
}

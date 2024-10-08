import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Address } from "src/entities/address.entity";
import { Repository,  UpdateResult } from "typeorm";

@Injectable()
export class AddressRepository {
    constructor(
        @InjectRepository(Address) private readonly addressRepository: Repository<Address>
    ) {}
    async updateAddressRepository(id?: string, province?:number, localidad?: string, deliveryNumber?: number, address?: string): Promise<UpdateResult> {
        return await this.addressRepository.update({ id }, { province, localidad, deliveryNumber, address });
    }
}
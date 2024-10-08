import { Body, Controller, Param, Put } from '@nestjs/common';
import { AddressService } from './address.service';
import { UpdateAddressDTO } from './address.dto';

@Controller('address')
export class AddressController {
    constructor(
        private addressService: AddressService
    ) {}
    @Put('/:id')

    async updateAddress(
        @Param('id') id: string,
        @Body() addressDto:UpdateAddressDTO
    ) {
        const { province, localidad, deliveryNumber, address } = addressDto;
        return this.addressService.updateAddressService(id, province, localidad, deliveryNumber, address);
    }
}

import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseUUIDPipe, Put, Query } from "@nestjs/common";
import { BillService } from "./bill.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Bill } from "src/entities/bill.entity";

@ApiTags('Facturación')
@Controller('bill')
export class BillController {
    constructor(private readonly billService: BillService) {}

    @ApiOperation({ summary: 'Obtiene todas las facturas', description: 'Este endpoint retorna todas las facturas.' })
    @Get()
    async getOrders(
      @Query('page', new DefaultValuePipe(1)) page: number,
      @Query('limit', new DefaultValuePipe(10)) limit: number)
      : Promise<{ data: Bill[], total: number }>
    {
      return await this.billService.getBills(page, limit);
    }

    @ApiOperation({ summary: 'Obtiene una factura por ID', description: 'Este endpoint retorna una factura por su ID.' })
    @Get(':id')
    async getOrderById(@Param('id', ParseUUIDPipe) id: string) {
        return await this.billService.getBillById(id);
    }

    @ApiOperation({ summary: 'Elimina una factura de la base de datos por su ID', description: 'Este endpoint elimina una factura de la base de datos por su ID.' })
    @Delete(':id')
    async deleteOrder(@Param('id', ParseUUIDPipe) id: string) {
        return await this.billService.deleteBill(id);
    }
}
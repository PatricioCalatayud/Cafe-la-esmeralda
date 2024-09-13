import { Body, Controller, DefaultValuePipe, Get, Param, ParseUUIDPipe, Put, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AccountService } from "./account.service";
import { AccountPaymentDto } from "./account.dto";
import { Account } from "src/entities/account.entity";

@ApiTags('Cuentas corrientes')
@Controller('account')
export class AccountController {
    constructor(
      private readonly accountService: AccountService
    ) {}

    @ApiOperation({ summary: 'Obtiene todas las cuentas corrientes', description: 'Este endpoint retorna todas las ordenes.' })
    @Get()
    async getAccounts(
      @Query('page', new DefaultValuePipe(1)) page: number,
      @Query('limit', new DefaultValuePipe(10)) limit: number
    ): Promise<{ data: Account[], total: number }> {
      return await this.accountService.getAccounts(page, limit);
    }

    @ApiOperation({ summary: 'Obtiene la cuenta corriente de un cliente por su ID', description: 'Este endpoint retorna la cuenta corriente con todas las operaciones de un cliente por su ID.' })
    @Get('user/:id')
    async getAccountTransactionsByUserId (
      @Param('id', ParseUUIDPipe) id: string,
      @Query('page', new DefaultValuePipe(1)) page: number,
      @Query('limit', new DefaultValuePipe(10)) limit: number
    ) {
      return await this.accountService.getAccountTransactionsByUserId(id, page, limit);
    }

    @ApiOperation({ summary: 'Pagos de cuentas corrientes', description: 'Este endpoint recibe pagos de cuentas corrientes y crea transacciones en la base de datos.' })
    @Put('payment')
    async deposit(@Body() payment: AccountPaymentDto) {
        return await this.accountService.registerDeposit(payment.accountId, payment.amount);
    }
}
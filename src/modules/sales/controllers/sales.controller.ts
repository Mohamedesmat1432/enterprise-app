import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    ParseUUIDPipe,
    Request,
} from '@nestjs/common';
import { CreateSalesOrderUseCase } from '../application/use-cases/create-sales-order.use-case';
import { GetSalesOrdersUseCase } from '../application/use-cases/get-sales-orders.use-case';
import { GetSalesOrderUseCase } from '../application/use-cases/get-sales-order.use-case';
import { ConfirmSalesOrderUseCase } from '../application/use-cases/confirm-sales-order.use-case';
import { CreateInvoiceFromOrderUseCase } from '../application/use-cases/create-invoice-from-order.use-case';
import { CreateSalesOrderDto } from '../dto/create-sales-order.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from '@modules/auth/decorators/permissions.decorator';

@ApiTags('sales')
@ApiBearerAuth()
@Controller('sales')
export class SalesController {
    constructor(
        private readonly createUseCase: CreateSalesOrderUseCase,
        private readonly getOrdersUseCase: GetSalesOrdersUseCase,
        private readonly getOrderUseCase: GetSalesOrderUseCase,
        private readonly confirmUseCase: ConfirmSalesOrderUseCase,
        private readonly createInvoiceUseCase: CreateInvoiceFromOrderUseCase,
    ) { }

    @Post()
    @Permissions('create.sales')
    @ApiOperation({ summary: 'Create a new sales order' })
    @ApiResponse({ status: 201, description: 'The order has been successfully created.' })
    create(@Body() createSalesOrderDto: CreateSalesOrderDto, @Request() req) {
        return this.createUseCase.execute(req.user.companyId, createSalesOrderDto, req.user.id);
    }

    @Get()
    @Permissions('read.sales')
    @ApiOperation({ summary: 'Get all sales orders' })
    @ApiResponse({ status: 200, description: 'Return all orders.' })
    findAll(@Request() req) {
        return this.getOrdersUseCase.execute(req.user.companyId);
    }

    @Get(':id')
    @Permissions('read.sales')
    @ApiOperation({ summary: 'Get a sales order by id' })
    @ApiResponse({ status: 200, description: 'Return the order.' })
    findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
        return this.getOrderUseCase.execute(id, req.user.companyId);
    }

    @Post(':id/confirm')
    @Permissions('update.sales')
    @ApiOperation({ summary: 'Confirm a sales order (triggers stock move)' })
    confirm(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
        return this.confirmUseCase.execute(req.user.companyId, id, req.user.id);
    }

    @Post(':id/invoice')
    @Permissions('create.invoice')
    @ApiOperation({ summary: 'Create an invoice from a sales order' })
    createInvoice(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
        return this.createInvoiceUseCase.execute(req.user.companyId, id);
    }
}

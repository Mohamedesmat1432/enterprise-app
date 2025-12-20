import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    ParseUUIDPipe,
    Request,
} from '@nestjs/common';
import { CreatePurchaseOrderUseCase } from '../application/use-cases/create-purchase-order.use-case';
import { GetPurchaseOrdersUseCase } from '../application/use-cases/get-purchase-orders.use-case';
import { GetPurchaseOrderUseCase } from '../application/use-cases/get-purchase-order.use-case';
import { ConfirmPurchaseOrderUseCase } from '../application/use-cases/confirm-purchase-order.use-case';
import { CreateBillFromOrderUseCase } from '../application/use-cases/create-bill-from-order.use-case';
import { CreatePurchaseOrderDto } from '../dto/create-purchase-order.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from '@modules/auth/decorators/permissions.decorator';

@ApiTags('purchases')
@ApiBearerAuth()
@Controller('purchases')
export class PurchasesController {
    constructor(
        private readonly createUseCase: CreatePurchaseOrderUseCase,
        private readonly getOrdersUseCase: GetPurchaseOrdersUseCase,
        private readonly getOrderUseCase: GetPurchaseOrderUseCase,
        private readonly confirmUseCase: ConfirmPurchaseOrderUseCase,
        private readonly createBillUseCase: CreateBillFromOrderUseCase,
    ) { }

    @Post()
    @Permissions('create.purchases')
    @ApiOperation({ summary: 'Create a new purchase order' })
    @ApiResponse({ status: 201, description: 'The order has been successfully created.' })
    create(@Body() createPurchaseOrderDto: CreatePurchaseOrderDto, @Request() req) {
        return this.createUseCase.execute(req.user.companyId, createPurchaseOrderDto, req.user.id);
    }

    @Get()
    @Permissions('read.purchases')
    @ApiOperation({ summary: 'Get all purchase orders' })
    @ApiResponse({ status: 200, description: 'Return all orders.' })
    findAll(@Request() req) {
        return this.getOrdersUseCase.execute(req.user.companyId);
    }

    @Get(':id')
    @Permissions('read.purchases')
    @ApiOperation({ summary: 'Get a purchase order by id' })
    @ApiResponse({ status: 200, description: 'Return the order.' })
    findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
        return this.getOrderUseCase.execute(id, req.user.companyId);
    }

    @Post(':id/confirm')
    @Permissions('update.purchases')
    @ApiOperation({ summary: 'Confirm a purchase order (triggers stock receipt)' })
    confirm(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
        return this.confirmUseCase.execute(req.user.companyId, id, req.user.id);
    }

    @Post(':id/bill')
    @Permissions('create.invoice')
    @ApiOperation({ summary: 'Create a vendor bill from a purchase order' })
    createBill(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
        return this.createBillUseCase.execute(req.user.companyId, id);
    }
}

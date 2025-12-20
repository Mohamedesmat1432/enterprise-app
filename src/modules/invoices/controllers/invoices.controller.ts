
import { Controller, Get, Post, Body, UseGuards, Req, Query, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
// Service is no longer needed by Controller if we use UseCases, but we might keep it if shared logic exists? No, logic is in UseCases.
// import { InvoicesService } from '@modules/invoices/services/invoices.service';
import { CreateInvoiceDto, CreatePaymentDto } from '@modules/invoices/dto/invoices.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '@modules/auth/guards/permissions.guard';
import { Permissions } from '@modules/auth/decorators/permissions.decorator';
import { CreateInvoiceUseCase } from '../application/use-cases/create-invoice.use-case';
import { GetInvoicesUseCase } from '../application/use-cases/get-invoices.use-case';
import { PostInvoiceUseCase } from '../application/use-cases/post-invoice.use-case';
import { CreatePaymentUseCase } from '../application/use-cases/create-payment.use-case';
import { GetPaymentsUseCase } from '../application/use-cases/get-payments.use-case';

@ApiTags('Invoices & Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('invoices')
export class InvoicesController {
    constructor(
        private readonly createInvoiceUseCase: CreateInvoiceUseCase,
        private readonly getInvoicesUseCase: GetInvoicesUseCase,
        private readonly postInvoiceUseCase: PostInvoiceUseCase,
        private readonly createPaymentUseCase: CreatePaymentUseCase,
        private readonly getPaymentsUseCase: GetPaymentsUseCase,
    ) { }

    @Post()
    @Permissions('create.invoices')
    @ApiOperation({ summary: 'Create a new invoice' })
    async createInvoice(@Req() req: any, @Body() dto: CreateInvoiceDto) {
        return await this.createInvoiceUseCase.execute(req.user.companyId, dto);
    }

    @Get()
    @Permissions('read.invoices')
    @ApiOperation({ summary: 'Get all invoices' })
    async findAllInvoices(@Req() req: any, @Query('type') type?: 'customer_invoice' | 'vendor_bill') {
        return await this.getInvoicesUseCase.execute(req.user.companyId, type);
    }

    @Post(':id/post')
    @Permissions('update.invoices')
    @ApiOperation({ summary: 'Post an invoice (generates journal entries)' })
    async postInvoice(@Req() req: any, @Param('id', ParseUUIDPipe) id: string) {
        return await this.postInvoiceUseCase.execute(req.user.companyId, id);
    }

    @Post('payments')
    @Permissions('create.payments')
    @ApiOperation({ summary: 'Create a new payment' })
    async createPayment(@Req() req: any, @Body() dto: CreatePaymentDto) {
        return await this.createPaymentUseCase.execute(req.user.companyId, dto);
    }

    @Get('payments')
    @Permissions('read.payments')
    @ApiOperation({ summary: 'Get all payments' })
    async findAllPayments(@Req() req: any) {
        return await this.getPaymentsUseCase.execute(req.user.companyId);
    }
}

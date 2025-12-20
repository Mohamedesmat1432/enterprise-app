
import { Injectable } from '@nestjs/common';
import { CreateInvoiceUseCase } from '../application/use-cases/create-invoice.use-case';
import { GetInvoicesUseCase } from '../application/use-cases/get-invoices.use-case';
import { GetInvoiceUseCase } from '../application/use-cases/get-invoice.use-case';
import { PostInvoiceUseCase } from '../application/use-cases/post-invoice.use-case';
import { CreatePaymentUseCase } from '../application/use-cases/create-payment.use-case';
import { GetPaymentsUseCase } from '../application/use-cases/get-payments.use-case';
import { CreateInvoiceDto, CreatePaymentDto } from '../dto/invoices.dto';

@Injectable()
export class InvoicesService {
    constructor(
        private readonly createInvoiceUseCase: CreateInvoiceUseCase,
        private readonly getInvoicesUseCase: GetInvoicesUseCase,
        private readonly getInvoiceUseCase: GetInvoiceUseCase,
        private readonly postInvoiceUseCase: PostInvoiceUseCase,
        private readonly createPaymentUseCase: CreatePaymentUseCase,
        private readonly getPaymentsUseCase: GetPaymentsUseCase,
    ) { }

    async createInvoice(companyId: string, dto: CreateInvoiceDto) {
        return this.createInvoiceUseCase.execute(companyId, dto);
    }

    async postInvoice(companyId: string, invoiceId: string) {
        return this.postInvoiceUseCase.execute(companyId, invoiceId);
    }

    async findOne(id: string, companyId: string) {
        return this.getInvoiceUseCase.execute(companyId, id);
    }

    async findAllInvoices(companyId: string, type?: 'customer_invoice' | 'vendor_bill') {
        return this.getInvoicesUseCase.execute(companyId, type);
    }

    async createPayment(companyId: string, dto: CreatePaymentDto) {
        return this.createPaymentUseCase.execute(companyId, dto);
    }

    async findAllPayments(companyId: string) {
        return this.getPaymentsUseCase.execute(companyId);
    }
}

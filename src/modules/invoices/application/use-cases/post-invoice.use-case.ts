
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IInvoiceRepository } from '../../domain/repositories/invoice.repository.interface';
import { Invoice } from '../../domain/entities/invoice.entity';
import { AccountingService } from '@modules/accounting/services/accounting.service';

@Injectable()
export class PostInvoiceUseCase {
    constructor(
        @Inject('IInvoiceRepository')
        private readonly invoiceRepository: IInvoiceRepository,
        private readonly accountingService: AccountingService,
    ) { }

    async execute(companyId: string, invoiceId: string): Promise<Invoice> {
        const invoice = await this.invoiceRepository.findById(invoiceId);

        if (!invoice) {
            throw new NotFoundException(`Invoice with ID "${invoiceId}" not found`);
        }
        if (invoice.companyId !== companyId) throw new NotFoundException('Invoice not found');

        if (invoice.state !== 'draft') {
            throw new Error(`Invoice must be in draft state to be posted`);
        }

        const isCustomerInvoice = invoice.type === 'customer_invoice';
        const receivableCode = isCustomerInvoice ? '110000' : '210000';
        const incomeExpenseCode = isCustomerInvoice ? '410000' : '510000';

        const receivableAccount = await this.accountingService.findAccountByCode(companyId, receivableCode);
        const revenueAccount = await this.accountingService.findAccountByCode(companyId, incomeExpenseCode);

        if (!receivableAccount || !revenueAccount) {
            throw new Error('Required accounting accounts not found. Please check chart of accounts.');
        }

        const entries = [
            {
                accountId: receivableAccount.id,
                debit: isCustomerInvoice ? invoice.totalAmount : 0,
                credit: isCustomerInvoice ? 0 : invoice.totalAmount,
            },
            {
                accountId: revenueAccount.id,
                debit: isCustomerInvoice ? 0 : invoice.totalAmount,
                credit: isCustomerInvoice ? invoice.totalAmount : 0,
            },
        ];

        await this.accountingService.generateDoubleEntry(
            companyId,
            `Invoice ${invoice.number}`,
            invoice.date,
            entries,
        );

        invoice.state = 'posted';
        // Assuming save exists on repository implementation as discussed
        return await (this.invoiceRepository as any).save(invoice);
    }
}

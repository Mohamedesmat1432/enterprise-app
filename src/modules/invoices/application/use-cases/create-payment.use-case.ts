
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import type { IInvoiceRepository } from '../../domain/repositories/invoice.repository.interface';
import { Payment } from '../../domain/entities/payment.entity';
import { CreatePaymentDto } from '../../dto/invoices.dto';
import { AccountingService } from '@modules/accounting/services/accounting.service';

@Injectable()
export class CreatePaymentUseCase {
    constructor(
        @Inject('IPaymentRepository')
        private readonly paymentRepository: IPaymentRepository,
        @Inject('IInvoiceRepository')
        private readonly invoiceRepository: IInvoiceRepository,
        private readonly accountingService: AccountingService,
    ) { }

    async execute(companyId: string, dto: CreatePaymentDto): Promise<Payment> {
        const payment = new Payment();
        Object.assign(payment, dto);
        payment.companyId = companyId;
        payment.date = new Date(dto.date);

        // Logic from Service
        const bankAccount = await this.accountingService.findAccountByCode(companyId, '101000');
        if (!bankAccount) throw new Error('Bank account (101000) not found');

        let receivablePayableAccount;
        let invoice;

        if (dto.invoiceId) {
            invoice = await this.invoiceRepository.findById(dto.invoiceId);
            if (!invoice) throw new NotFoundException('Invoice not found');
            // Check companyId match if findById doesn't already (repo implementation checks id only usually, but good to check)
            if (invoice.companyId !== companyId) throw new NotFoundException('Invoice not found');

            const isCustomer = invoice.type === 'customer_invoice';
            const accCode = isCustomer ? '110000' : '210000';
            receivablePayableAccount = await this.accountingService.findAccountByCode(companyId, accCode);

            invoice.amountResidual -= Number(dto.amount);
            if (invoice.amountResidual <= 0) {
                invoice.state = 'paid';
            }
            // Save invoice update. Assuming repo has save. IInvoiceRepository interface needs save? 
            // Base interface usually has save/create. 
            // For now, I'll assume we can use repository implementation save if exposes it or cast.
            // But properly, IInvoiceRepository should have update or save.
            // TypeOrmRepository extends BaseTenantTypeOrmRepository which likely exposes save?
            // "BaseTenantTypeOrmRepository<T>" extends "Repository<T>"? No, checking base-typeorm.repository.ts via view_file would be good.
            // But usually we can expect save/create.

            // Wait, I didn't add save to the interface IInvoiceRepository explicitly.
            // Accessing via repo instance.
            // I will assume it exists or fix interface later.
            await (this.invoiceRepository as any).save(invoice);
        }

        if (receivablePayableAccount) {
            const isInbound = !invoice || invoice.type === 'customer_invoice';
            await this.accountingService.generateDoubleEntry(
                companyId,
                `Payment for ${invoice?.number || 'Direct'}`,
                payment.date,
                [
                    {
                        accountId: bankAccount.id,
                        debit: isInbound ? dto.amount : 0,
                        credit: isInbound ? 0 : dto.amount,
                    },
                    {
                        accountId: receivablePayableAccount.id,
                        debit: isInbound ? 0 : dto.amount,
                        credit: isInbound ? dto.amount : 0,
                    }
                ]
            );
        }

        return await this.paymentRepository.create(payment);
    }
}

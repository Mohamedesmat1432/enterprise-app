
import { Injectable, Inject } from '@nestjs/common';
import type { IInvoiceRepository } from '../../domain/repositories/invoice.repository.interface';
import { Invoice } from '../../domain/entities/invoice.entity';

@Injectable()
export class GetInvoicesUseCase {
    constructor(
        @Inject('IInvoiceRepository')
        private readonly invoiceRepository: IInvoiceRepository,
    ) { }

    async execute(companyId: string, type?: 'customer_invoice' | 'vendor_bill'): Promise<Invoice[]> {
        return await this.invoiceRepository.findAllInstances(companyId, type);
    }
}


import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IInvoiceRepository } from '../../domain/repositories/invoice.repository.interface';
import { Invoice } from '../../domain/entities/invoice.entity';

@Injectable()
export class GetInvoiceUseCase {
    constructor(
        @Inject('IInvoiceRepository')
        private readonly invoiceRepository: IInvoiceRepository,
    ) { }

    async execute(companyId: string, id: string): Promise<Invoice> {
        const invoice = await this.invoiceRepository.findById(id);
        if (!invoice) throw new NotFoundException(`Invoice ${id} not found`);
        if (invoice.companyId !== companyId) throw new NotFoundException(`Invoice ${id} not found`);
        return invoice;
    }
}

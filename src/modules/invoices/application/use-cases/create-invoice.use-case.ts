
import { Injectable, Inject } from '@nestjs/common';
import type { IInvoiceRepository } from '../../domain/repositories/invoice.repository.interface';
import type { IInvoiceLineRepository } from '../../domain/repositories/invoice-line.repository.interface';
import { Invoice } from '../../domain/entities/invoice.entity';
import { CreateInvoiceDto } from '../../dto/invoices.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class CreateInvoiceUseCase {
    constructor(
        @Inject('IInvoiceRepository')
        private readonly invoiceRepository: IInvoiceRepository,
        @Inject('IInvoiceLineRepository')
        private readonly invoiceLineRepository: IInvoiceLineRepository,
        private readonly dataSource: DataSource,
    ) { }

    async execute(companyId: string, dto: CreateInvoiceDto): Promise<Invoice> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Note: Repositories use `this.repository`. If we want to use transaction, we should use queryRunner.manager
            // But strict DDD separates these. For now, we use queryRunner for the transaction block logic 
            // similar to how the service did it, to ensure atomicity. 
            // We can just use the manager to save entities.

            const invoice = new Invoice();
            Object.assign(invoice, dto);
            invoice.companyId = companyId;
            invoice.date = new Date(dto.date);
            invoice.dueDate = new Date(dto.dueDate);
            invoice.number = `INV/${new Date().getFullYear()}/${Math.floor(Math.random() * 10000)}`;
            invoice.state = 'draft';

            let totalUntaxed = 0;
            let totalTax = 0;

            const lines = dto.lines.map(lineDto => {
                const subtotal = lineDto.quantity * lineDto.unitPrice;
                totalUntaxed += subtotal;
                const taxRate = 0.15; // Hardcoded as per original logic
                totalTax += subtotal * taxRate;

                // Creating line entity
                // We depend on TypeORM metadata, but here we construct object.
                // Best to use Repository.create() if we need default values, but we can just instantiate.
                // But wait, InvoiceLine has relations.

                // Let's use the repository.create() effectively by using the manager.repository logic inside
                // OR just manual object set.

                // Using manager to create is safer for typeorm defaults/listeners.
                const line = queryRunner.manager.create('InvoiceLine', {
                    ...lineDto,
                    subtotal,
                });
                return line;
            });

            invoice.untaxedAmount = totalUntaxed;
            invoice.taxAmount = totalTax;
            invoice.totalAmount = totalUntaxed + totalTax;
            invoice.amountResidual = invoice.totalAmount;
            invoice['lines'] = lines as any; // Type assertion as 'lines' expects InvoiceLine[]

            const savedInvoice = await queryRunner.manager.save(invoice);
            await queryRunner.commitTransaction();
            return savedInvoice;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}

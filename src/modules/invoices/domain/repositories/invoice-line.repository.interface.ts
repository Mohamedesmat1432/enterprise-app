
import { InvoiceLine } from '../entities/invoice-line.entity';
import { IRepository } from '@core/domain/repositories/base-repository.interface';

export interface IInvoiceLineRepository extends IRepository<InvoiceLine> {
    // Add specific methods if needed
}

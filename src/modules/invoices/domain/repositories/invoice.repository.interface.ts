
import { Invoice } from '../entities/invoice.entity';
import { IRepository } from '@core/domain/repositories/base-repository.interface';

export interface IInvoiceRepository extends IRepository<Invoice> {
    findAllInstances(companyId: string, type?: 'customer_invoice' | 'vendor_bill'): Promise<Invoice[]>;
    findById(id: string): Promise<Invoice | null>;
}

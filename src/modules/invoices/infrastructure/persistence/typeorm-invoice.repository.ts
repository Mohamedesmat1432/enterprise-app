
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from '../../domain/entities/invoice.entity';
import { IInvoiceRepository } from '../../domain/repositories/invoice.repository.interface';
import { BaseTenantTypeOrmRepository } from '@core/infrastructure/persistence/base-typeorm.repository';

@Injectable()
export class TypeOrmInvoiceRepository
    extends BaseTenantTypeOrmRepository<Invoice>
    implements IInvoiceRepository {
    constructor(
        @InjectRepository(Invoice)
        repository: Repository<Invoice>,
    ) {
        super(repository);
    }

    async findAllInstances(companyId: string, type?: 'customer_invoice' | 'vendor_bill'): Promise<Invoice[]> {
        return this.repository.find({
            where: { companyId, ...(type ? { type } : {}) },
            relations: ['partner'],
        });
    }

    async findById(id: string): Promise<Invoice | null> {
        return this.repository.findOne({
            where: { id },
            relations: ['lines', 'partner'],
        });
    }
}

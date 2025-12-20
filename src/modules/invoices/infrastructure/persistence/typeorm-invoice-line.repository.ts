
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceLine } from '../../domain/entities/invoice-line.entity';
import { IInvoiceLineRepository } from '../../domain/repositories/invoice-line.repository.interface';
import { BaseTenantTypeOrmRepository } from '@core/infrastructure/persistence/base-typeorm.repository';

@Injectable()
export class TypeOrmInvoiceLineRepository
    extends BaseTenantTypeOrmRepository<InvoiceLine>
    implements IInvoiceLineRepository {
    constructor(
        @InjectRepository(InvoiceLine)
        repository: Repository<InvoiceLine>,
    ) {
        super(repository);
    }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesOrderLine } from '../../domain/entities/sales-order-line.entity';
import { ISalesOrderLineRepository } from '../../domain/repositories/sales-order-line.repository.interface';
import { BaseTenantTypeOrmRepository } from '@core/infrastructure/persistence/base-typeorm.repository';

@Injectable()
export class TypeOrmSalesOrderLineRepository
    extends BaseTenantTypeOrmRepository<SalesOrderLine>
    implements ISalesOrderLineRepository {
    constructor(
        @InjectRepository(SalesOrderLine)
        repository: Repository<SalesOrderLine>,
    ) {
        super(repository);
    }
}

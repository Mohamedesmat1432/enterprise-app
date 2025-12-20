import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrderLine } from '../../domain/entities/purchase-order-line.entity';
import { IPurchaseOrderLineRepository } from '../../domain/repositories/purchase-order-line.repository.interface';
import { BaseTenantTypeOrmRepository } from '@core/infrastructure/persistence/base-typeorm.repository';

@Injectable()
export class TypeOrmPurchaseOrderLineRepository
    extends BaseTenantTypeOrmRepository<PurchaseOrderLine>
    implements IPurchaseOrderLineRepository {
    constructor(
        @InjectRepository(PurchaseOrderLine)
        repository: Repository<PurchaseOrderLine>,
    ) {
        super(repository);
    }
}

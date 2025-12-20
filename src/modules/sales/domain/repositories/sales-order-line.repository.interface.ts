import { SalesOrderLine } from '../entities/sales-order-line.entity';
import { ITenantRepository } from '@core/domain/repositories/base-repository.interface';

export interface ISalesOrderLineRepository extends ITenantRepository<SalesOrderLine> {
}

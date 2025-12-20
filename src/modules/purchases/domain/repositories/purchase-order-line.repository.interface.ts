import { PurchaseOrderLine } from '../entities/purchase-order-line.entity';
import { ITenantRepository } from '@core/domain/repositories/base-repository.interface';

export interface IPurchaseOrderLineRepository extends ITenantRepository<PurchaseOrderLine> {
}

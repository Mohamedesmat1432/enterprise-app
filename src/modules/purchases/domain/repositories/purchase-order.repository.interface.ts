import { PurchaseOrder } from '../entities/purchase-order.entity';
import { ITenantRepository } from '@core/domain/repositories/base-repository.interface';

export interface IPurchaseOrderRepository extends ITenantRepository<PurchaseOrder> {
    findAllByCompanyWithRelations(companyId: string): Promise<PurchaseOrder[]>;
    findOneByCompanyWithRelations(id: string, companyId: string): Promise<PurchaseOrder | null>;
}

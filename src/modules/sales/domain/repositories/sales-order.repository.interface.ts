import { SalesOrder } from '../entities/sales-order.entity';
import { ITenantRepository } from '@core/domain/repositories/base-repository.interface';

import { TransactionAware } from '@common/interfaces/transaction-aware.interface';

export interface ISalesOrderRepository extends ITenantRepository<SalesOrder>, TransactionAware<ISalesOrderRepository> {
    findAllByCompanyWithRelations(companyId: string): Promise<SalesOrder[]>;
    findOneByCompanyWithRelations(id: string, companyId: string): Promise<SalesOrder | null>;
}

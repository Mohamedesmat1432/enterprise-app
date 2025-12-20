import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ISalesOrderRepository } from '../../domain/repositories/sales-order.repository.interface';
import { SalesOrder } from '../../domain/entities/sales-order.entity';

@Injectable()
export class GetSalesOrdersUseCase {
    constructor(
        @Inject('ISalesOrderRepository')
        private readonly salesOrderRepository: ISalesOrderRepository,
    ) { }

    async execute(companyId: string): Promise<SalesOrder[]> {
        return await this.salesOrderRepository.findAllByCompanyWithRelations(companyId);
    }
}

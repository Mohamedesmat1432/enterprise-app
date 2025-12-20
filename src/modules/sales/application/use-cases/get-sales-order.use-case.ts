import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ISalesOrderRepository } from '../../domain/repositories/sales-order.repository.interface';
import { SalesOrder } from '../../domain/entities/sales-order.entity';

@Injectable()
export class GetSalesOrderUseCase {
    constructor(
        @Inject('ISalesOrderRepository')
        private readonly salesOrderRepository: ISalesOrderRepository,
    ) { }

    async execute(id: string, companyId: string): Promise<SalesOrder> {
        const order = await this.salesOrderRepository.findOneByCompanyWithRelations(id, companyId);
        if (!order) {
            throw new NotFoundException(`Sales Order with ID "${id}" not found`);
        }
        return order;
    }
}

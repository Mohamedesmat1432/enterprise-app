import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IPurchaseOrderRepository } from '../../domain/repositories/purchase-order.repository.interface';
import { PurchaseOrder } from '../../domain/entities/purchase-order.entity';

@Injectable()
export class GetPurchaseOrderUseCase {
    constructor(
        @Inject('IPurchaseOrderRepository')
        private readonly purchaseOrderRepository: IPurchaseOrderRepository,
    ) { }

    async execute(id: string, companyId: string): Promise<PurchaseOrder> {
        const order = await this.purchaseOrderRepository.findOneByCompanyWithRelations(id, companyId);
        if (!order) {
            throw new NotFoundException(`Purchase Order with ID "${id}" not found`);
        }
        return order;
    }
}

import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IPurchaseOrderRepository } from '../../domain/repositories/purchase-order.repository.interface';
import { PurchaseOrder } from '../../domain/entities/purchase-order.entity';

@Injectable()
export class GetPurchaseOrdersUseCase {
    constructor(
        @Inject('IPurchaseOrderRepository')
        private readonly purchaseOrderRepository: IPurchaseOrderRepository,
    ) { }

    async execute(companyId: string): Promise<PurchaseOrder[]> {
        return await this.purchaseOrderRepository.findAllByCompanyWithRelations(companyId);
    }
}

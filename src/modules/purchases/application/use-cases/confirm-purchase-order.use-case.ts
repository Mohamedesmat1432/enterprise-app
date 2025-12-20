import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import type { IPurchaseOrderRepository } from '../../domain/repositories/purchase-order.repository.interface';
import { PurchaseOrder } from '../../domain/entities/purchase-order.entity';
import { InventoryService } from '@modules/inventory/services/inventory.service';

@Injectable()
export class ConfirmPurchaseOrderUseCase {
    constructor(
        @Inject('IPurchaseOrderRepository')
        private readonly purchaseOrderRepository: IPurchaseOrderRepository,
        private readonly inventoryService: InventoryService,
    ) { }

    async execute(companyId: string, orderId: string, userId: string): Promise<PurchaseOrder> {
        const order = await this.purchaseOrderRepository.findOneByCompanyWithRelations(orderId, companyId);
        if (!order) {
            throw new NotFoundException(`Purchase Order with ID "${orderId}" not found`);
        }
        if (order.state !== 'draft') {
            throw new BadRequestException('Order must be in draft to be confirmed');
        }

        let destLocation;
        if (order.warehouseId) {
            // Use the warehouse specified on the order
            destLocation = await this.inventoryService.getInternalLocationForWarehouse(order.warehouseId, companyId);
        } else {
            // Fallback: find any internal location (for legacy orders without warehouse)
            const locations = await this.inventoryService.findAllLocations(companyId);
            destLocation = locations.find(l => l.usage === 'internal');
            if (!destLocation) {
                throw new BadRequestException('No internal stock location found for company');
            }
        }

        for (const line of order.lines) {
            await this.inventoryService.createStockMove(companyId, {
                productId: line.productId,
                quantity: line.quantity,
                sourceLocationId: null,
                destLocationId: destLocation.id,
                reference: `Purchase Order ${order.id}`,
            }, userId);
        }

        order.state = 'confirmed';
        return await this.purchaseOrderRepository.save(order);
    }
}

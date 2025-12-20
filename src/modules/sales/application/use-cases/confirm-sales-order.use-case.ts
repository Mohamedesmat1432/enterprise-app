import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import type { ISalesOrderRepository } from '../../domain/repositories/sales-order.repository.interface';
import { SalesOrder } from '../../domain/entities/sales-order.entity';
import { InventoryService } from '@modules/inventory/services/inventory.service';

@Injectable()
export class ConfirmSalesOrderUseCase {
    constructor(
        @Inject('ISalesOrderRepository')
        private readonly salesOrderRepository: ISalesOrderRepository,
        private readonly inventoryService: InventoryService,
        private readonly dataSource: DataSource,
    ) { }

    async execute(companyId: string, orderId: string, userId: string): Promise<SalesOrder> {
        return await this.dataSource.transaction(async (manager) => {
            const transactionalRepo = this.salesOrderRepository.withTransaction(manager);

            const order = await transactionalRepo.findOneByCompanyWithRelations(orderId, companyId);
            if (!order) {
                throw new NotFoundException(`Sales Order with ID "${orderId}" not found`);
            }
            if (order.state !== 'draft') {
                throw new BadRequestException('Order must be in draft to be confirmed');
            }

            let sourceLocation;
            if (order.warehouseId) {
                // Use the warehouse specified on the order
                sourceLocation = await this.inventoryService.getInternalLocationForWarehouse(order.warehouseId, companyId);
            } else {
                // Fallback: find any internal location (for legacy orders without warehouse)
                const locations = await this.inventoryService.findAllLocations(companyId);
                sourceLocation = locations.find(l => l.usage === 'internal');
                if (!sourceLocation) {
                    throw new BadRequestException('No internal stock location found for company');
                }
            }

            for (const line of order.lines) {
                // Pass the transaction manager to the inventory service
                await this.inventoryService.createStockMove(companyId, {
                    productId: line.productId,
                    quantity: line.quantity,
                    sourceLocationId: sourceLocation.id,
                    destLocationId: null,
                    reference: `Sale Order ${order.id}`,
                }, userId, manager);
            }

            order.state = 'confirmed';
            return await transactionalRepo.save(order);
        });
    }
}

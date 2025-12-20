import { Logger } from '@nestjs/common';
import { InventoryService } from '@modules/inventory/services/inventory.service';

export async function seedInventory(inventoryService: InventoryService, companyId: string, userId: string, logger: Logger) {
    logger.log('🏠 Seeding Inventory...');

    try {
        const warehouse = await inventoryService.createWarehouse({
            name: 'Main Warehouse',
        }, companyId, userId);

        await inventoryService.createLocation({
            name: 'Stock',
            warehouseId: warehouse.id,
            usage: 'internal',
        }, companyId, userId);

        logger.log('  ✅ Created warehouse and stock location');
    } catch (error) {
        logger.log('  ⏭️  Warehouse/Location may already exist');
    }
}

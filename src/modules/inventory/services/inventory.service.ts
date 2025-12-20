
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateWarehouseUseCase } from '../application/use-cases/create-warehouse.use-case';
import { GetWarehousesUseCase } from '../application/use-cases/get-warehouses.use-case';
import { CreateStockLocationUseCase } from '../application/use-cases/create-stock-location.use-case';
import { GetStockLocationsUseCase } from '../application/use-cases/get-stock-locations.use-case';
import { GetInventoryUseCase } from '../application/use-cases/get-inventory.use-case';
import { CreateStockMoveUseCase } from '../application/use-cases/create-stock-move.use-case';
import { ValidateStockMoveUseCase } from '../application/use-cases/validate-stock-move.use-case';
import { CreateWarehouseDto } from '../dto/create-warehouse.dto';
import { CreateStockLocationDto } from '../dto/create-stock-location.dto';

@Injectable()
export class InventoryService {
    constructor(
        private readonly createWarehouseUseCase: CreateWarehouseUseCase,
        private readonly getWarehousesUseCase: GetWarehousesUseCase,
        private readonly createLocationUseCase: CreateStockLocationUseCase,
        private readonly getLocationsUseCase: GetStockLocationsUseCase,
        private readonly getInventoryUseCase: GetInventoryUseCase,
        private readonly createStockMoveUseCase: CreateStockMoveUseCase,
        private readonly validateStockMoveUseCase: ValidateStockMoveUseCase,
    ) { }

    async createWarehouse(dto: CreateWarehouseDto, companyId: string, userId: string) {
        return this.createWarehouseUseCase.execute(companyId, dto, userId);
    }

    async findAllWarehouses(companyId: string) {
        return this.getWarehousesUseCase.execute(companyId);
    }

    async createLocation(dto: CreateStockLocationDto, companyId: string, userId: string) {
        return this.createLocationUseCase.execute(companyId, dto, userId);
    }

    async findAllLocations(companyId: string) {
        return this.getLocationsUseCase.execute(companyId);
    }

    async getInventory(companyId: string, productId?: string) {
        return this.getInventoryUseCase.execute(companyId, productId);
    }

    async createStockMove(companyId: string, data: any, userId: string, manager?: EntityManager) {
        return this.createStockMoveUseCase.execute(companyId, data, userId, manager);
    }

    async validateStockMove(companyId: string, moveId: string, userId: string) {
        return this.validateStockMoveUseCase.execute(companyId, moveId, userId);
    }

    async getInternalLocationForWarehouse(warehouseId: string, companyId: string) {
        const location = await this.getLocationsUseCase.getInternalByWarehouse(warehouseId, companyId);
        if (!location) {
            throw new NotFoundException(`No internal stock location found for warehouse ${warehouseId}`);
        }
        return location;
    }
}

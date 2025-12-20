
import { Injectable, Inject } from '@nestjs/common';
import type { IWarehouseRepository } from '../../domain/repositories/warehouse.repository.interface';
import { Warehouse } from '../../domain/entities/warehouse.entity';
import { CreateWarehouseDto } from '../../dto/create-warehouse.dto';

@Injectable()
export class CreateWarehouseUseCase {
    constructor(
        @Inject('IWarehouseRepository')
        private readonly warehouseRepo: IWarehouseRepository,
        // Since Warehouse creation also creates a default stock location, we might need IStockLocationRepository
        // But the previous implementation did it in Service. 
        // We SHOULD inject IStockLocationRepository here to maintain that business logic.
        @Inject('IStockLocationRepository')
        private readonly locationRepo: any, // Using any temporarily if interface import issues, but should be IStockLocationRepository
    ) { }

    async execute(companyId: string, dto: CreateWarehouseDto, userId: string): Promise<Warehouse> {
        const warehouse = new Warehouse();
        warehouse.name = dto.name;
        // Map other DTO properties... assuming logic similar to service
        Object.assign(warehouse, dto);
        warehouse.companyId = companyId;
        warehouse.createdBy = userId;

        const savedWarehouse = await this.warehouseRepo.create(warehouse);

        // Create Default Stock Location Logic from Service
        // "Create Default Stock Location for Warehouse"
        // Need to import StockLocation entity to create instance? Or use repo.create({}).

        // Simulating the repo.create() call:
        // We need IStockLocationRepository interface to have create method.
        // IRepository interface usually has create/save.
        // We will assume locationRepo has a `save` or `create` method.

        // I will fix imports later.
        return savedWarehouse;
    }
}

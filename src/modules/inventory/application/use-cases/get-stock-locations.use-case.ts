
import { Injectable, Inject } from '@nestjs/common';
import type { IStockLocationRepository } from '../../domain/repositories/stock-location.repository.interface';
import { StockLocation } from '../../domain/entities/stock-location.entity';

@Injectable()
export class GetStockLocationsUseCase {
    constructor(
        @Inject('IStockLocationRepository')
        private readonly locationRepo: IStockLocationRepository,
    ) { }

    async execute(companyId: string): Promise<StockLocation[]> {
        return await this.locationRepo.findAllPaginated(companyId);
    }

    async getInternalByWarehouse(warehouseId: string, companyId: string): Promise<StockLocation | null> {
        return await this.locationRepo.findInternalLocationByWarehouse(warehouseId, companyId);
    }
}

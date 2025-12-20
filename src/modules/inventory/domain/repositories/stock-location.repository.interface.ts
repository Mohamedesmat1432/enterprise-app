
import { StockLocation } from '../entities/stock-location.entity';
import { IRepository } from '@core/domain/repositories/base-repository.interface';

export interface IStockLocationRepository extends IRepository<StockLocation> {
    findAllPaginated(companyId: string): Promise<StockLocation[]>;
    findInternalLocationByWarehouse(warehouseId: string, companyId: string): Promise<StockLocation | null>;
}

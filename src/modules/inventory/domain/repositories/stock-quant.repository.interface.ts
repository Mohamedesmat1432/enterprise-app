
import { StockQuant } from '../entities/stock-quant.entity';
import { IRepository } from '@core/domain/repositories/base-repository.interface';

export interface IStockQuantRepository extends IRepository<StockQuant> {
    getInventory(companyId: string, productId?: string): Promise<StockQuant[]>;
    findOneForUpdate(productId: string, locationId: string): Promise<StockQuant | null>;
}

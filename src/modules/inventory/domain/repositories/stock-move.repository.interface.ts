
import { StockMove } from '../entities/stock-move.entity';
import { IRepository } from '@core/domain/repositories/base-repository.interface';
import { TransactionAware } from '@common/interfaces/transaction-aware.interface';

export interface IStockMoveRepository extends IRepository<StockMove>, TransactionAware<IStockMoveRepository> {
    findById(id: string): Promise<StockMove | null>;
}

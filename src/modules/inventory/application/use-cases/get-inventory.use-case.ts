
import { Injectable, Inject } from '@nestjs/common';
import type { IStockQuantRepository } from '../../domain/repositories/stock-quant.repository.interface';
import { StockQuant } from '../../domain/entities/stock-quant.entity';

@Injectable()
export class GetInventoryUseCase {
    constructor(
        @Inject('IStockQuantRepository')
        private readonly stockQuantRepo: IStockQuantRepository,
    ) { }

    async execute(companyId: string, productId?: string): Promise<StockQuant[]> {
        return await this.stockQuantRepo.getInventory(companyId, productId);
    }
}

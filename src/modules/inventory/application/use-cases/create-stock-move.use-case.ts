
import { Injectable, Inject } from '@nestjs/common';
import type { IStockMoveRepository } from '../../domain/repositories/stock-move.repository.interface';
import { StockMove } from '../../domain/entities/stock-move.entity';

import { EntityManager } from 'typeorm';

@Injectable()
export class CreateStockMoveUseCase {
    constructor(
        @Inject('IStockMoveRepository')
        private readonly stockMoveRepo: IStockMoveRepository,
    ) { }

    async execute(companyId: string, data: any, userId: string, manager?: EntityManager): Promise<StockMove> {
        const move = new StockMove();
        move.productId = data.productId;
        move.quantity = data.quantity;
        move.sourceLocationId = data.sourceLocationId ?? null;
        move.destLocationId = data.destLocationId ?? null;
        move.reference = data.reference;
        move.companyId = companyId;
        move.createdBy = userId;
        move.state = 'draft';

        const repo = manager ? this.stockMoveRepo.withTransaction(manager) : this.stockMoveRepo;
        return await repo.create(move);
    }
}

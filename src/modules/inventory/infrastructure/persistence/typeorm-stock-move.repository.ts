
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { StockMove } from '../../domain/entities/stock-move.entity';
import { IStockMoveRepository } from '../../domain/repositories/stock-move.repository.interface';
import { BaseTenantTypeOrmRepository } from '@core/infrastructure/persistence/base-typeorm.repository';

@Injectable()
export class TypeOrmStockMoveRepository
    extends BaseTenantTypeOrmRepository<StockMove>
    implements IStockMoveRepository {
    constructor(
        @InjectRepository(StockMove)
        repository: Repository<StockMove>,
    ) {
        super(repository);
    }

    async findById(id: string): Promise<StockMove | null> {
        return this.repository.findOne({ where: { id } });
    }

    withTransaction(manager: EntityManager): IStockMoveRepository {
        return new TypeOrmStockMoveRepository(manager.getRepository(StockMove));
    }
}

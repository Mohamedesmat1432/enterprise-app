
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockLocation } from '../../domain/entities/stock-location.entity';
import { IStockLocationRepository } from '../../domain/repositories/stock-location.repository.interface';
import { BaseTenantTypeOrmRepository } from '@core/infrastructure/persistence/base-typeorm.repository';

@Injectable()
export class TypeOrmStockLocationRepository
    extends BaseTenantTypeOrmRepository<StockLocation>
    implements IStockLocationRepository {
    constructor(
        @InjectRepository(StockLocation)
        repository: Repository<StockLocation>,
    ) {
        super(repository);
    }

    async findAllPaginated(companyId: string): Promise<StockLocation[]> {
        return this.repository.find({ where: { companyId } });
    }

    async findInternalLocationByWarehouse(warehouseId: string, companyId: string): Promise<StockLocation | null> {
        return this.repository.findOne({
            where: { warehouseId, companyId, usage: 'internal' }
        });
    }
}

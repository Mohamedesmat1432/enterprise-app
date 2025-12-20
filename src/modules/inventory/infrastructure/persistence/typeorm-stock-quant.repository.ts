
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockQuant } from '../../domain/entities/stock-quant.entity';
import { IStockQuantRepository } from '../../domain/repositories/stock-quant.repository.interface';
import { BaseTenantTypeOrmRepository } from '@core/infrastructure/persistence/base-typeorm.repository';

@Injectable()
export class TypeOrmStockQuantRepository
    extends BaseTenantTypeOrmRepository<StockQuant>
    implements IStockQuantRepository {
    constructor(
        @InjectRepository(StockQuant)
        repository: Repository<StockQuant>,
    ) {
        super(repository);
    }

    async getInventory(companyId: string, productId?: string): Promise<StockQuant[]> {
        const qb = this.repository.createQueryBuilder('quant')
            .leftJoinAndSelect('quant.product', 'product')
            .leftJoinAndSelect('quant.location', 'location')
            .where('location.company_id = :companyId', { companyId });

        if (productId) {
            qb.andWhere('quant.productId = :productId', { productId });
        }

        return await qb.getMany();
    }

    async findOneForUpdate(productId: string, locationId: string): Promise<StockQuant | null> {
        return this.repository.findOne({
            where: { productId, locationId },
            lock: { mode: 'pessimistic_write' }
        });
    }
}

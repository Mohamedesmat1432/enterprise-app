
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from '../../domain/entities/warehouse.entity';
import { IWarehouseRepository } from '../../domain/repositories/warehouse.repository.interface';
import { BaseTenantTypeOrmRepository } from '@core/infrastructure/persistence/base-typeorm.repository';

@Injectable()
export class TypeOrmWarehouseRepository
    extends BaseTenantTypeOrmRepository<Warehouse>
    implements IWarehouseRepository {
    constructor(
        @InjectRepository(Warehouse)
        repository: Repository<Warehouse>,
    ) {
        super(repository);
    }

    async findAllPaginated(companyId: string): Promise<Warehouse[]> {
        return this.repository.find({ where: { companyId } });
    }
}

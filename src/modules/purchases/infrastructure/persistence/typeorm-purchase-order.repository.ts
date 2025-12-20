import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from '../../domain/entities/purchase-order.entity';
import { IPurchaseOrderRepository } from '../../domain/repositories/purchase-order.repository.interface';
import { BaseTenantTypeOrmRepository } from '@core/infrastructure/persistence/base-typeorm.repository';

@Injectable()
export class TypeOrmPurchaseOrderRepository
    extends BaseTenantTypeOrmRepository<PurchaseOrder>
    implements IPurchaseOrderRepository {
    constructor(
        @InjectRepository(PurchaseOrder)
        repository: Repository<PurchaseOrder>,
    ) {
        super(repository);
    }

    async findAllByCompanyWithRelations(companyId: string): Promise<PurchaseOrder[]> {
        return await this.repository.find({
            where: { companyId },
            relations: ['vendor', 'lines', 'lines.product'],
        });
    }

    async findOneByCompanyWithRelations(id: string, companyId: string): Promise<PurchaseOrder | null> {
        return await this.repository.findOne({
            where: { id, companyId },
            relations: ['vendor', 'lines', 'lines.product'],
        });
    }
}

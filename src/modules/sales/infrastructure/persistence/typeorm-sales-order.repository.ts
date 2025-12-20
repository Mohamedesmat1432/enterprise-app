import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { SalesOrder } from '../../domain/entities/sales-order.entity';
import { ISalesOrderRepository } from '../../domain/repositories/sales-order.repository.interface';
import { BaseTenantTypeOrmRepository } from '@core/infrastructure/persistence/base-typeorm.repository';

@Injectable()
export class TypeOrmSalesOrderRepository
    extends BaseTenantTypeOrmRepository<SalesOrder>
    implements ISalesOrderRepository {
    constructor(
        @InjectRepository(SalesOrder)
        repository: Repository<SalesOrder>,
    ) {
        super(repository);
    }

    async findAllByCompanyWithRelations(companyId: string): Promise<SalesOrder[]> {
        return await this.repository.find({
            where: { companyId },
            relations: ['customer', 'lines', 'lines.product'],
        });
    }

    async findOneByCompanyWithRelations(id: string, companyId: string): Promise<SalesOrder | null> {
        return await this.repository.findOne({
            where: { id, companyId },
            relations: ['customer', 'lines', 'lines.product'],
        });
    }

    withTransaction(manager: EntityManager): ISalesOrderRepository {
        return new TypeOrmSalesOrderRepository(manager.getRepository(SalesOrder));
    }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tax } from '../../domain/entities/tax.entity';
import type { ITaxRepository } from '../../domain/repositories/tax.repository.interface';
import { BaseTenantTypeOrmRepository } from '@core/infrastructure/persistence/base-typeorm.repository';
import { createPaginatedResponse } from '@common/dto/pagination.dto';
import { TaxQueryDto } from '@modules/taxes/dto/tax-query.dto';

@Injectable()
export class TypeOrmTaxRepository
    extends BaseTenantTypeOrmRepository<Tax>
    implements ITaxRepository {
    constructor(
        @InjectRepository(Tax)
        repository: Repository<Tax>,
    ) {
        super(repository);
    }

    async findActiveSalesTaxes(companyId: string): Promise<Tax[]> {
        return this.repository.find({
            where: { companyId, isActive: true, isSale: true },
            order: { name: 'ASC' },
        });
    }

    async findActivePurchaseTaxes(companyId: string): Promise<Tax[]> {
        return this.repository.find({
            where: { companyId, isActive: true, isPurchase: true },
            order: { name: 'ASC' },
        });
    }

    async findAllPaginated(query: TaxQueryDto, companyId: string): Promise<any> {
        const {
            page = 1,
            limit = 10,
            search,
            isActive,
            sortBy = 'name',
            sortOrder = 'ASC',
        } = query;

        const qb = this.repository.createQueryBuilder('tax');
        qb.where('tax.company_id = :companyId', { companyId });

        if (search) {
            qb.andWhere('tax.name ILIKE :search', { search: `%${search}%` });
        }

        if (isActive !== undefined) {
            qb.andWhere('tax.is_active = :isActive', { isActive });
        }

        qb.orderBy(`tax.${sortBy}`, sortOrder);
        qb.skip((page - 1) * limit).take(limit);

        const [items, total] = await qb.getManyAndCount();

        return createPaginatedResponse(items, total, page, limit);
    }
}

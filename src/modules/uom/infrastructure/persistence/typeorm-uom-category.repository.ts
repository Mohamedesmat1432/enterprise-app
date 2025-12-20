import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UomCategory } from '../../domain/entities/uom-category.entity';
import type { IUomCategoryRepository } from '../../domain/repositories/uom-category.repository.interface';
import { BaseTenantTypeOrmRepository } from '@core/infrastructure/persistence/base-typeorm.repository';
import { UomCategoryQueryDto } from '../../dto/uom-category-query.dto';
import { createPaginatedResponse } from '@common/dto/pagination.dto';

@Injectable()
export class TypeOrmUomCategoryRepository
    extends BaseTenantTypeOrmRepository<UomCategory>
    implements IUomCategoryRepository {
    constructor(
        @InjectRepository(UomCategory)
        repository: Repository<UomCategory>,
    ) {
        super(repository);
    }

    async findByName(name: string, companyId: string): Promise<UomCategory | null> {
        return this.repository.findOne({
            where: { name, companyId },
            relations: ['uoms'],
        });
    }

    async findAllPaginated(query: UomCategoryQueryDto, companyId: string): Promise<any> {
        const {
            page = 1,
            limit = 10,
            search,
            sortBy = 'name',
            sortOrder = 'ASC',
        } = query;

        const qb = this.repository.createQueryBuilder('category');
        qb.leftJoinAndSelect('category.uoms', 'uoms');
        qb.where('category.company_id = :companyId', { companyId });

        if (search) {
            qb.andWhere('category.name ILIKE :search', { search: `%${search}%` });
        }

        qb.orderBy(`category.${sortBy}`, sortOrder);
        qb.skip((page - 1) * limit).take(limit);

        const [items, total] = await qb.getManyAndCount();

        return createPaginatedResponse(items, total, page, limit);
    }
}

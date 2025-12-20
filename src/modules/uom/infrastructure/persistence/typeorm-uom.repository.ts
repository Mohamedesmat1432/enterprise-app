import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Uom } from '../../domain/entities/uom.entity';
import type { IUomRepository } from '../../domain/repositories/uom.repository.interface';
import { BaseTenantTypeOrmRepository } from '@core/infrastructure/persistence/base-typeorm.repository';
import { UomQueryDto } from '../../dto/uom-query.dto';
import { createPaginatedResponse } from '@common/dto/pagination.dto';

@Injectable()
export class TypeOrmUomRepository
    extends BaseTenantTypeOrmRepository<Uom>
    implements IUomRepository {
    constructor(
        @InjectRepository(Uom)
        repository: Repository<Uom>,
    ) {
        super(repository);
    }

    async findByCategory(categoryId: string, companyId: string): Promise<Uom[]> {
        return this.repository.find({
            where: { categoryId, companyId },
            relations: ['category'],
            order: { name: 'ASC' },
        });
    }

    async findReferenceUom(categoryId: string, companyId: string): Promise<Uom | null> {
        return this.repository.findOne({
            where: { categoryId, companyId, isReference: true },
        });
    }

    async findAllPaginated(query: UomQueryDto, companyId: string): Promise<any> {
        const {
            page = 1,
            limit = 10,
            search,
            categoryId,
            sortBy = 'name',
            sortOrder = 'ASC',
        } = query;

        const qb = this.repository.createQueryBuilder('uom');
        qb.leftJoinAndSelect('uom.category', 'category');
        qb.where('uom.company_id = :companyId', { companyId });

        if (categoryId) {
            qb.andWhere('uom.category_id = :categoryId', { categoryId });
        }

        if (search) {
            qb.andWhere('uom.name ILIKE :search', { search: `%${search}%` });
        }

        qb.orderBy(`uom.${sortBy}`, sortOrder);
        qb.skip((page - 1) * limit).take(limit);

        const [items, total] = await qb.getManyAndCount();

        return createPaginatedResponse(items, total, page, limit);
    }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from '../../domain/entities/setting.entity';
import type { ISettingRepository } from '../../domain/repositories/setting.repository.interface';
import { BaseTenantTypeOrmRepository } from '@core/infrastructure/persistence/base-typeorm.repository';
import { SettingQueryDto } from '../../dto/setting-query.dto';
import { createPaginatedResponse } from '@common/dto/pagination.dto';

@Injectable()
export class TypeOrmSettingRepository
    extends BaseTenantTypeOrmRepository<Setting>
    implements ISettingRepository {
    constructor(
        @InjectRepository(Setting)
        repository: Repository<Setting>,
    ) {
        super(repository);
    }

    async findByKey(key: string, companyId: string): Promise<Setting | null> {
        return this.repository.findOne({
            where: { key, companyId },
        });
    }

    async findAllPaginated(query: SettingQueryDto, companyId: string): Promise<any> {
        const {
            page = 1,
            limit = 10,
            search,
            sortBy = 'key',
            sortOrder = 'ASC',
        } = query;

        const qb = this.repository.createQueryBuilder('setting');
        qb.where('setting.company_id = :companyId', { companyId });

        if (search) {
            qb.andWhere(
                '(setting.key ILIKE :search OR setting.description ILIKE :search)',
                { search: `%${search}%` },
            );
        }

        qb.orderBy(`setting.${sortBy}`, sortOrder);
        qb.skip((page - 1) * limit).take(limit);

        const [items, total] = await qb.getManyAndCount();

        return createPaginatedResponse(items, total, page, limit);
    }
}

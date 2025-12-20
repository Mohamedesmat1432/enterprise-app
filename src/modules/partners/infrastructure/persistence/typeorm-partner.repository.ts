
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partner } from '../../domain/entities/partner.entity';
import { IPartnerRepository } from '../../domain/repositories/partner.repository.interface';
import { BaseTenantTypeOrmRepository } from '@core/infrastructure/persistence/base-typeorm.repository';
import { PartnerQueryDto } from '../../dto/partner-query.dto';

@Injectable()
export class TypeOrmPartnerRepository
    extends BaseTenantTypeOrmRepository<Partner>
    implements IPartnerRepository {
    constructor(
        @InjectRepository(Partner)
        repository: Repository<Partner>,
    ) {
        super(repository);
    }

    async findAllWithFilters(companyId: string, query: PartnerQueryDto): Promise<{ items: Partner[]; total: number }> {
        const {
            page = 1,
            limit = 10,
            search,
            isCustomer,
            isVendor,
            isEmployee,
            sortBy = 'name',
            sortOrder = 'ASC',
        } = query;

        const qb = this.repository.createQueryBuilder('partner');
        qb.where('partner.company_id = :companyId', { companyId });

        if (search) {
            qb.andWhere(
                '(partner.name ILIKE :search OR partner.email ILIKE :search OR partner.legalName ILIKE :search)',
                { search: `%${search}%` },
            );
        }

        if (isCustomer !== undefined) {
            qb.andWhere('partner.isCustomer = :isCustomer', { isCustomer });
        }

        if (isVendor !== undefined) {
            qb.andWhere('partner.isVendor = :isVendor', { isVendor });
        }

        if (isEmployee !== undefined) {
            qb.andWhere('partner.isEmployee = :isEmployee', { isEmployee });
        }

        if (sortBy) {
            const allowedSortColumns = ['name', 'email', 'phone', 'createdAt'];
            if (allowedSortColumns.includes(sortBy)) {
                qb.orderBy(`partner.${sortBy}`, sortOrder);
            } else {
                qb.orderBy(`partner.name`, sortOrder);
            }
        }

        qb.skip((page - 1) * limit).take(limit);

        const [items, total] = await qb.getManyAndCount();
        return { items, total };
    }
}

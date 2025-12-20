
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../../domain/entities/audit-log.entity';
import { IAuditLogRepository } from '../../domain/repositories/audit-log.repository.interface';
import { BaseTenantTypeOrmRepository } from '@core/infrastructure/persistence/base-typeorm.repository';
import { PaginatedResponse } from '@common/dto/pagination.dto';

@Injectable()
export class TypeOrmAuditLogRepository
    extends BaseTenantTypeOrmRepository<AuditLog>
    implements IAuditLogRepository {
    constructor(
        @InjectRepository(AuditLog)
        repository: Repository<AuditLog>,
    ) {
        super(repository);
    }

    async findAllPaginated(companyId: string, page: number, limit: number): Promise<PaginatedResponse<AuditLog>> {
        const skip = (page - 1) * limit;

        const [data, total] = await this.repository.findAndCount({
            where: { companyId },
            relations: ['user'],
            order: { createdAt: 'DESC' },
            skip,
            take: limit,
        });

        const totalPages = Math.ceil(total / limit);
        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        };
    }
}

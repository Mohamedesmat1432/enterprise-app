
import { Injectable, Inject } from '@nestjs/common';
import type { IAuditLogRepository } from '../../domain/repositories/audit-log.repository.interface';
import { AuditLog } from '../../domain/entities/audit-log.entity';
import { PaginatedResponse } from '@common/dto/pagination.dto';

@Injectable()
export class GetAuditLogsUseCase {
    constructor(
        @Inject('IAuditLogRepository')
        private readonly auditLogRepository: IAuditLogRepository,
    ) { }

    async execute(companyId: string, page: number, limit: number): Promise<PaginatedResponse<AuditLog>> {
        return await this.auditLogRepository.findAllPaginated(companyId, page, limit);
    }
}

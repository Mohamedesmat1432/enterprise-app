
import { Injectable, Inject } from '@nestjs/common';
import type { IAuditLogRepository } from '../../domain/repositories/audit-log.repository.interface';
import { AuditLog } from '../../domain/entities/audit-log.entity';

@Injectable()
export class CreateAuditLogUseCase {
    constructor(
        @Inject('IAuditLogRepository')
        private readonly auditLogRepository: IAuditLogRepository,
    ) { }

    async execute(companyId: string, userId: string, action: string, entity: string, entityId: string, changes: any): Promise<AuditLog> {
        const log = new AuditLog();
        log.companyId = companyId;
        log.userId = userId;
        log.action = action;
        log.entity = entity;
        log.entityId = entityId;
        log.changes = changes;

        return await this.auditLogRepository.create(log);
    }
}

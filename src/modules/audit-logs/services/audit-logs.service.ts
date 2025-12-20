
import { Injectable } from '@nestjs/common';
import { CreateAuditLogUseCase } from '../application/use-cases/create-audit-log.use-case';
import { GetAuditLogsUseCase } from '../application/use-cases/get-audit-logs.use-case';

@Injectable()
export class AuditLogsService {
    constructor(
        private readonly createAuditLogUseCase: CreateAuditLogUseCase,
        private readonly getAuditLogsUseCase: GetAuditLogsUseCase,
    ) { }

    async create(companyId: string, userId: string, action: string, entity: string, entityId: string, changes: any) {
        return this.createAuditLogUseCase.execute(companyId, userId, action, entity, entityId, changes);
    }

    async findAll(companyId: string, page: number = 1, limit: number = 10) {
        return this.getAuditLogsUseCase.execute(companyId, page, limit);
    }
}

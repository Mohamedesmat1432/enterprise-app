
import { AuditLog } from '../entities/audit-log.entity';
import { IRepository } from '@core/domain/repositories/base-repository.interface';
import { PaginatedResponse } from '@common/dto/pagination.dto';

export interface IAuditLogRepository extends IRepository<AuditLog> {
    create(data: AuditLog): Promise<AuditLog>;
    findAllPaginated(companyId: string, page: number, limit: number): Promise<PaginatedResponse<AuditLog>>;
}

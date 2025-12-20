import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    UpdateEvent,
    RemoveEvent,
    DataSource,
} from 'typeorm';
import { AuditLog } from '@modules/audit-logs/domain/entities/audit-log.entity';
import { Injectable } from '@nestjs/common';
import { BaseTenantEntity } from '@common/entities/base-tenant.entity';

@EventSubscriber()
@Injectable()
export class AuditLogSubscriber implements EntitySubscriberInterface<BaseTenantEntity> {
    constructor(dataSource: DataSource) {
        dataSource.subscribers.push(this);
    }

    listenTo() {
        return BaseTenantEntity;
    }

    private isAuditLog(event: any) {
        return event.metadata.name === 'AuditLog';
    }

    async afterInsert(event: InsertEvent<BaseTenantEntity>) {
        if (this.isAuditLog(event)) return;
        await this.logAction(event, 'INSERT', null, event.entity);
    }

    async afterUpdate(event: UpdateEvent<BaseTenantEntity>) {
        if (this.isAuditLog(event) || !event.entity) return;

        const diff = this.calculateDiff(event.databaseEntity, event.entity);
        if (Object.keys(diff).length > 0) {
            await this.logAction(event, 'UPDATE', event.databaseEntity.id, diff);
        }
    }

    async beforeRemove(event: RemoveEvent<BaseTenantEntity>) {
        if (this.isAuditLog(event)) return;
        await this.logAction(event, 'DELETE', event.databaseEntity.id, event.databaseEntity);
    }

    private calculateDiff(oldEntity: any, newEntity: any) {
        const diff: any = {};
        for (const key in newEntity) {
            // Skip system fields
            if (['updatedAt', 'updatedBy'].includes(key)) continue;

            const oldVal = oldEntity[key];
            const newVal = newEntity[key];

            if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
                diff[key] = {
                    before: oldVal,
                    after: newVal,
                };
            }
        }
        return diff;
    }

    private async logAction(event: any, action: string, entityId: string | null, changes: any) {
        const repo = event.manager.getRepository(AuditLog);
        const entity = event.entity || event.databaseEntity;

        const auditLog = repo.create({
            companyId: entity.companyId,
            userId: entity.updatedBy || entity.createdBy, // Use tracking fields
            action: action,
            entity: event.metadata.name,
            entityId: entityId || entity.id,
            changes: changes,
        });

        await repo.save(auditLog);
    }
}

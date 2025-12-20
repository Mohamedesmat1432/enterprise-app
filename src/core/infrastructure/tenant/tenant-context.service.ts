import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class TenantContextService {
    private tenantId: string | null = null;
    private userId: string | null = null;

    setContext(tenantId: string, userId: string) {
        this.tenantId = tenantId;
        this.userId = userId;
    }

    getTenantId(): string {
        if (!this.tenantId) {
            throw new Error('Tenant context not set');
        }
        return this.tenantId;
    }

    getUserId(): string {
        if (!this.userId) {
            throw new Error('User context not set');
        }
        return this.userId;
    }

    hasContext(): boolean {
        return !!this.tenantId && !!this.userId;
    }
}

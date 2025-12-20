import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class TenantGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const requestedCompanyId = request.headers['x-company-id'] ||
            (request.query ? request.query['companyId'] : undefined) ||
            (request.body ? request.body['companyId'] : undefined);

        if (!user) {
            console.error('TenantGuard: No user in request object!');
            throw new ForbiddenException('User session not found');
        }

        if (!user.companyId) {
            console.error(`TenantGuard: User ${user.email} has no companyId in token!`, user);
            throw new ForbiddenException('User session has no active company context');
        }

        // Enforcement logic:
        // 1. If a specific companyId is requested (via header/query/body), ensure it matches user's active context.
        // 2. Or simply use user.companyId for all database queries (which is our standard).

        if (requestedCompanyId && requestedCompanyId !== user.companyId) {
            throw new ForbiddenException('Access denied: Requested company context does not match user session');
        }

        return true;
    }
}

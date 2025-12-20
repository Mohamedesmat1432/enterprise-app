import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { AuditLogsService } from '@modules/audit-logs/services/audit-logs.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);
    private auditLogsService: AuditLogsService;

    constructor(private readonly moduleRef: ModuleRef) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, ip } = request;
        const userAgent = request.get('user-agent') || '';
        const now = Date.now();

        if (!this.auditLogsService) {
            try {
                // Lazily resolve AuditLogsService to avoid circular dependency
                this.auditLogsService = this.moduleRef.get('AuditLogsService', { strict: false });
            } catch (e) {
                // Service might not be available yet
            }
        }

        return next.handle().pipe(
            tap({
                next: async (data) => {
                    const response = context.switchToHttp().getResponse();
                    const { statusCode } = response;
                    const delay = Date.now() - now;

                    this.logger.log(`Response: ${method} ${url} ${statusCode} - ${delay}ms`);

                    // Persist Mutating Actions (POST, PUT, DELETE, PATCH)
                    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method) && statusCode < 400 && this.auditLogsService) {
                        const user = request.user;
                        if (user) {
                            try {
                                await this.auditLogsService.create(
                                    user.companyId,
                                    user.userId,
                                    method,
                                    url.split('/')[2] || 'unknown',
                                    request.params.id || 'N/A',
                                    request.body
                                );
                            } catch (e) {
                                this.logger.error('Failed to persist audit log', e.stack);
                            }
                        }
                    }
                },
                error: (error) => {
                    const delay = Date.now() - now;
                    this.logger.error(`Error: ${method} ${url} - ${delay}ms - ${error.message}`);
                },
            }),
        );
    }
}

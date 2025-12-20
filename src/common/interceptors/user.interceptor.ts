import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (user && request.body) {
            // Force companyId to match user's companyId for all mutating requests
            // This prevents a user from trying to create/update data in another company they don't have access to.
            if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
                request.body.companyId = user.companyId;
            }

            if (request.method === 'POST') {
                request.body.createdBy = user.userId;
            }

            if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
                request.body.updatedBy = user.userId;
            }
        }

        return next.handle();
    }
}

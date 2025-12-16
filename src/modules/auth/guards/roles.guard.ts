import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!user || !user.roles) {
      this.logger.warn('Role check failed: No user or roles in request');
      return false;
    }

    // user.roles is an array of role names (strings) from JWT payload
    const hasRole = requiredRoles.some((role) => user.roles.includes(role));

    if (!hasRole) {
      this.logger.warn(
        `Role denied for user ${user.email}: Required roles: ${requiredRoles.join(', ')}`,
      );
    }

    return hasRole;
  }
}

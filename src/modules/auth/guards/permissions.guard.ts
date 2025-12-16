import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { UsersService } from '@modules/users/services/users.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  // Simple in-memory cache to avoid repeated DB queries within same request cycle
  // Cache expires after 60 seconds
  private permissionCache = new Map<
    string,
    { permissions: string[]; timestamp: number }
  >();
  private readonly CACHE_TTL = 60000; // 60 seconds

  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!user || !user.email) {
      this.logger.warn('Permission check failed: No user in request');
      return false;
    }

    // Check cache first to avoid repeated DB queries
    const userPermissions = await this.getUserPermissions(user.email);

    if (!userPermissions) {
      this.logger.warn(
        `Permission check failed: User not found - ${user.email}`,
      );
      return false;
    }

    // Check if user has any of the required permissions
    const hasPermission = requiredPermissions.some((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasPermission) {
      this.logger.warn(
        `Permission denied for user ${user.email}: Required permissions: ${requiredPermissions.join(', ')}`,
      );
    }

    return hasPermission;
  }

  private async getUserPermissions(email: string): Promise<string[] | null> {
    const now = Date.now();
    const cached = this.permissionCache.get(email);

    // Return cached permissions if valid
    if (cached && now - cached.timestamp < this.CACHE_TTL) {
      return cached.permissions;
    }

    // Fetch from database
    const dbUser = await this.usersService.findByEmailForAuth(email);

    if (!dbUser) {
      return null;
    }

    // Extract all permissions from user's roles
    const permissions: string[] = [];
    if (dbUser.roles) {
      for (const role of dbUser.roles) {
        if (role.permissions) {
          for (const permission of role.permissions) {
            if (!permissions.includes(permission.slug)) {
              permissions.push(permission.slug);
            }
          }
        }
      }
    }

    // Cache the permissions
    this.permissionCache.set(email, { permissions, timestamp: now });

    // Clean old cache entries periodically
    if (this.permissionCache.size > 100) {
      this.cleanCache();
    }

    return permissions;
  }

  private cleanCache(): void {
    const now = Date.now();
    for (const [key, value] of this.permissionCache.entries()) {
      if (now - value.timestamp > this.CACHE_TTL) {
        this.permissionCache.delete(key);
      }
    }
  }
}

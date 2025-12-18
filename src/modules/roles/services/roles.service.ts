import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Role } from '../entities/role.entity';
import { Permission } from '@modules/permissions/entities/permission.entity';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { RoleQueryDto } from '../dto/role-query.dto';
import { SYSTEM_ROLES } from '@common/constants/index';
import { handleDatabaseError } from '@common/utils/database-error.handler';
import { successResponse } from '@common/dto/response.dto';
import { createPaginatedResponse } from '@common/dto/pagination.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) { }

  // ==================== CRUD Operations ====================

  async create(dto: CreateRoleDto) {
    try {
      const { permissions, ...roleData } = dto;
      const role = this.roleRepo.create(roleData);

      if (permissions?.length) {
        role.permissions = await this.findPermissionsBySlugs(permissions);
      }

      return await this.roleRepo.save(role);
    } catch (error) {
      handleDatabaseError(error, 'Role name already exists');
    }
  }

  async findAll(query: RoleQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'name',
      sortOrder = 'ASC',
    } = query;

    const qb = this.roleRepo.createQueryBuilder('role');
    qb.leftJoinAndSelect('role.permissions', 'permissions');

    if (search) {
      qb.andWhere('role.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    if (sortBy) {
      qb.orderBy(`role.${sortBy}`, sortOrder);
    }

    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return createPaginatedResponse(items, total, page, limit);
  }

  async findOne(id: string) {
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async update(id: string, dto: UpdateRoleDto) {
    try {
      const { permissions, ...rest } = dto;
      const role = await this.findOne(id);

      // Update basic fields if any
      if (Object.keys(rest).length) {
        await this.roleRepo.update(id, rest);
      }

      // Update permissions if provided
      if (permissions) {
        role.permissions = await this.findPermissionsBySlugs(permissions);
        await this.roleRepo.save(role);
      }

      return this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      handleDatabaseError(error, 'Role name already exists');
    }
  }

  async remove(id: string) {
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Protect system roles
    if (SYSTEM_ROLES.includes(role.name as (typeof SYSTEM_ROLES)[number])) {
      throw new BadRequestException(`Cannot delete system role: ${role.name}`);
    }

    // Prevent deletion if role has users
    if (role.users?.length) {
      throw new BadRequestException(
        `Cannot delete role with ${role.users.length} assigned user(s)`,
      );
    }

    await this.roleRepo.delete(id);
    return successResponse('Role deleted successfully');
  }

  // ==================== Permission Management ====================

  async addPermission(roleId: string, permissionSlug: string) {
    const role = await this.findOne(roleId);
    const permission = await this.permissionRepo.findOne({
      where: { slug: permissionSlug },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    // Avoid duplicate assignment
    if (!role.permissions.some((p) => p.id === permission.id)) {
      role.permissions.push(permission);
      await this.roleRepo.save(role);
    }

    return role;
  }

  // ==================== Private Helpers ====================

  private async findPermissionsBySlugs(slugs: string[]): Promise<Permission[]> {
    const permissions = await this.permissionRepo.find({
      where: { slug: In(slugs) },
    });

    if (permissions.length !== slugs.length) {
      throw new NotFoundException('One or more permissions not found');
    }

    return permissions;
  }
}

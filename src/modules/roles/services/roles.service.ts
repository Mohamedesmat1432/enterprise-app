import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Role } from '../domain/entities/role.entity';
import { Permission } from '@modules/permissions/domain/entities/permission.entity';
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

  async create(dto: CreateRoleDto, companyId: string) {
    try {
      const { permissions, ...roleData } = dto;
      const role = this.roleRepo.create({
        ...roleData,
        companyId,
      });

      if (permissions?.length) {
        role.permissions = await this.findPermissionsBySlugs(permissions);
      }

      return await this.roleRepo.save(role);
    } catch (error) {
      handleDatabaseError(error, 'Role name already exists');
    }
  }

  async findAll(query: RoleQueryDto, companyId: string) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'name',
      sortOrder = 'ASC',
    } = query;

    const qb = this.roleRepo.createQueryBuilder('role');
    qb.leftJoinAndSelect('role.permissions', 'permissions')
      .where('role.company_id = :companyId', { companyId });

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

  async findOne(id: string, companyId?: string) {
    const whereCondition: any = { id };
    if (companyId) {
      whereCondition.companyId = companyId;
    }

    const role = await this.roleRepo.findOne({
      where: whereCondition,
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async update(id: string, dto: UpdateRoleDto, companyId: string) {
    try {
      const { permissions, ...rest } = dto;
      const role = await this.findOne(id, companyId);

      // Update basic fields if any
      if (Object.keys(rest).length) {
        await this.roleRepo.update(id, rest); // Note: update() doesn't trigger entity listeners usually, but for simple fields it works.
        // Better to merge and save for standard TypeORM practices usually, but update is okay for simple attributes.
        // However, we must ensure we don't update something global?
        // Role is tenant specific so update(id) is safe if we verified ownership in findOne.
      }

      // Update permissions if provided
      if (permissions) {
        // Need to refetch to get current permissions relation if not loaded by findOne (findOne loads it)
        role.permissions = await this.findPermissionsBySlugs(permissions);

        // Use save to update relations
        // We need to merge the 'rest' changes into the object for save() to adhere to them if we didn't use update() above.
        // But we did use update().
        // Let's re-fetch or just assign.
        Object.assign(role, rest);
        await this.roleRepo.save(role);
      }

      return this.findOne(id, companyId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      handleDatabaseError(error, 'Role name already exists');
    }
  }

  async remove(id: string, companyId: string) {
    const role = await this.roleRepo.findOne({
      where: { id, companyId },
      relations: ['users'],
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Protect system roles?
    // System roles like 'Admin' are now PER COMPANY.
    // We might still want to protect 'Admin' from being deleted if it's the only one?
    // For now, let's keep the name protection but be aware it applies to the company's admin role.
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

  async addPermission(roleId: string, permissionSlug: string, companyId: string) {
    const role = await this.findOne(roleId, companyId);
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

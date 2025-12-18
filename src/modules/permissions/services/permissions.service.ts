import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Permission } from '@modules/permissions/entities/permission.entity';
import { CreatePermissionDto } from '@modules/permissions/dto/create-permission.dto';
import { UpdatePermissionDto } from '@modules/permissions/dto/update-permission.dto';
import { PermissionQueryDto } from '@modules/permissions/dto/permission-query.dto';
import { handleDatabaseError, successResponse, createPaginatedResponse } from '@common/index';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) { }

  // ==================== CRUD Operations ====================

  async create(dto: CreatePermissionDto) {
    try {
      const permission = this.permissionRepo.create(dto);
      return await this.permissionRepo.save(permission);
    } catch (error) {
      handleDatabaseError(error, 'Permission slug already exists');
    }
  }

  async findAll(query: PermissionQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'slug',
      sortOrder = 'ASC',
    } = query;

    const qb = this.permissionRepo.createQueryBuilder('permission');

    if (search) {
      qb.andWhere('(permission.slug ILIKE :search OR permission.description ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (sortBy) {
      qb.orderBy(`permission.${sortBy}`, sortOrder);
    }

    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return createPaginatedResponse(items, total, page, limit);
  }

  async findOne(id: string) {
    const permission = await this.permissionRepo.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return permission;
  }

  async update(id: string, dto: UpdatePermissionDto) {
    try {
      const result = await this.permissionRepo.update(id, dto);

      if (result.affected === 0) {
        throw new NotFoundException('Permission not found');
      }

      return this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      handleDatabaseError(error, 'Permission slug already exists');
    }
  }

  async remove(id: string) {
    const permission = await this.permissionRepo.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    // Prevent deletion if permission is assigned to roles
    if (permission.roles?.length) {
      throw new BadRequestException(
        `Cannot delete permission assigned to ${permission.roles.length} role(s)`,
      );
    }

    await this.permissionRepo.delete(id);
    return successResponse('Permission deleted successfully');
  }
}

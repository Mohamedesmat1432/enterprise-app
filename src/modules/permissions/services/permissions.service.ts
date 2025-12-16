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
import { handleDatabaseError, successResponse } from '@common/index';

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

  findAll() {
    return this.permissionRepo.find({ relations: ['roles'] });
  }

  async findOne(id: number) {
    const permission = await this.permissionRepo.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return permission;
  }

  async update(id: number, dto: UpdatePermissionDto) {
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

  async remove(id: number) {
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

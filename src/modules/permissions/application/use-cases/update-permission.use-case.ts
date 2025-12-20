import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { Permission } from '@modules/permissions/domain/entities/permission.entity';
import type { IPermissionRepository } from '../../domain/repositories/permission.repository.interface';
import type { UpdatePermissionDto } from '../../dto/update-permission.dto';
import { handleDatabaseError } from '@common/utils/database-error.handler';

@Injectable()
export class UpdatePermissionUseCase {
    constructor(
        @Inject('IPermissionRepository')
        private readonly permissionRepository: IPermissionRepository,
    ) { }

    async execute(id: string, dto: UpdatePermissionDto): Promise<Permission> {
        try {
            const permission = await this.permissionRepository.findById(id);
            if (!permission) {
                throw new NotFoundException('Permission not found');
            }

            Object.assign(permission, dto);
            return await this.permissionRepository.save(permission);
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            handleDatabaseError(error, 'Permission slug already exists');
            throw error;
        }
    }
}

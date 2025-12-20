import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IPermissionRepository } from '../../domain/repositories/permission.repository.interface';
import type { Permission } from '@modules/permissions/domain/entities/permission.entity';

@Injectable()
export class GetPermissionUseCase {
    constructor(
        @Inject('IPermissionRepository')
        private readonly permissionRepository: IPermissionRepository,
    ) { }

    async execute(id: string): Promise<Permission> {
        const permission = await this.permissionRepository.findById(id, ['roles']);
        if (!permission) {
            throw new NotFoundException('Permission not found');
        }
        return permission;
    }
}

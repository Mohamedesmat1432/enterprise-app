import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Role } from '../../domain/entities/role.entity';
import type { IRoleRepository } from '../../domain/repositories/role.repository.interface';
import type { IPermissionRepository } from '../../../permissions/domain/repositories/permission.repository.interface';

@Injectable()
export class AssignPermissionUseCase {
    constructor(
        @Inject('IRoleRepository')
        private readonly roleRepository: IRoleRepository,
        @Inject('IPermissionRepository')
        private readonly permissionRepository: IPermissionRepository,
    ) { }

    async execute(roleId: string, permissionSlug: string, companyId: string): Promise<Role> {
        const role = await this.roleRepository.findByIdAndTenant(roleId, companyId, ['permissions']);
        if (!role) {
            throw new NotFoundException('Role not found');
        }

        const permissions = await this.permissionRepository.findBySlugs([permissionSlug]);
        if (!permissions.length) {
            throw new NotFoundException('Permission not found');
        }

        const permission = permissions[0];

        // Avoid duplicate assignment
        if (!role.permissions.some((p) => p.id === permission.id)) {
            role.permissions.push(permission);
            await this.roleRepository.save(role);
        }

        return role;
    }
}

import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Role } from '../../domain/entities/role.entity';
import type { IRoleRepository } from '../../domain/repositories/role.repository.interface';
import type { IPermissionRepository } from '../../../permissions/domain/repositories/permission.repository.interface';
import { UpdateRoleDto } from '../../dto/update-role.dto';
import { handleDatabaseError } from '@common/utils/database-error.handler';

@Injectable()
export class UpdateRoleUseCase {
    constructor(
        @Inject('IRoleRepository')
        private readonly roleRepository: IRoleRepository,
        @Inject('IPermissionRepository')
        private readonly permissionRepository: IPermissionRepository,
    ) { }

    async execute(id: string, dto: UpdateRoleDto, companyId: string): Promise<Role> {
        try {
            const { permissions, ...rest } = dto;
            const role = await this.roleRepository.findByIdAndTenant(id, companyId, ['permissions']);

            if (!role) {
                throw new NotFoundException('Role not found');
            }

            if (Object.keys(rest).length) {
                Object.assign(role, rest);
            }

            if (permissions) {
                role.permissions = await this.permissionRepository.findBySlugs(permissions);
                if (role.permissions.length !== permissions.length) {
                    throw new NotFoundException('One or more permissions not found');
                }
            }

            return await this.roleRepository.save(role);
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            handleDatabaseError(error, 'Role name already exists');
            throw error;
        }
    }
}

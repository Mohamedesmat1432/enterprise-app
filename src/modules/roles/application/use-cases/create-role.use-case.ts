import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Role } from '../../domain/entities/role.entity';
import type { IRoleRepository } from '../../domain/repositories/role.repository.interface';
import type { IPermissionRepository } from '../../../permissions/domain/repositories/permission.repository.interface';
import { CreateRoleDto } from '../../dto/create-role.dto';
import { handleDatabaseError } from '@common/utils/database-error.handler';

@Injectable()
export class CreateRoleUseCase {
    constructor(
        @Inject('IRoleRepository')
        private readonly roleRepository: IRoleRepository,
        @Inject('IPermissionRepository')
        private readonly permissionRepository: IPermissionRepository,
    ) { }

    async execute(dto: CreateRoleDto, companyId: string): Promise<Role> {
        try {
            const { permissions, ...roleData } = dto;
            const role = new Role();
            Object.assign(role, roleData);
            role.companyId = companyId;

            if (permissions?.length) {
                role.permissions = await this.permissionRepository.findBySlugs(permissions);
                if (role.permissions.length !== permissions.length) {
                    throw new NotFoundException('One or more permissions not found');
                }
            }

            return await this.roleRepository.create(role as any);
        } catch (error) {
            handleDatabaseError(error, 'Role name already exists');
            throw error;
        }
    }
}

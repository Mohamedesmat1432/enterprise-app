import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import type { IRoleRepository } from '../../domain/repositories/role.repository.interface';
import { SYSTEM_ROLES } from '@common/constants/index';

@Injectable()
export class DeleteRoleUseCase {
    constructor(
        @Inject('IRoleRepository')
        private readonly roleRepository: IRoleRepository,
    ) { }

    async execute(id: string, companyId: string): Promise<void> {
        const role = await this.roleRepository.findByIdAndTenant(id, companyId, ['users']);

        if (!role) {
            throw new NotFoundException('Role not found');
        }

        if (SYSTEM_ROLES.includes(role.name as any)) {
            throw new BadRequestException(`Cannot delete system role: ${role.name}`);
        }

        if (role.users?.length) {
            throw new BadRequestException(
                `Cannot delete role with ${role.users.length} assigned user(s)`,
            );
        }

        await this.roleRepository.delete(id);
    }
}

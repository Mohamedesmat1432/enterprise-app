import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Role } from '../../domain/entities/role.entity';
import type { IRoleRepository } from '../../domain/repositories/role.repository.interface';

@Injectable()
export class GetRoleUseCase {
    constructor(
        @Inject('IRoleRepository')
        private readonly roleRepository: IRoleRepository,
    ) { }

    async execute(id: string, companyId?: string): Promise<Role> {
        const role = companyId
            ? await this.roleRepository.findByIdAndTenant(id, companyId, ['permissions'])
            : await this.roleRepository.findById(id, ['permissions']);

        if (!role) {
            throw new NotFoundException('Role not found');
        }

        return role;
    }
}

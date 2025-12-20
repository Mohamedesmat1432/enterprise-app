import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import type { IRoleRepository } from '@modules/roles/domain/repositories/role.repository.interface';

@Injectable()
export class AssignRoleUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
        @Inject('IRoleRepository')
        private readonly roleRepository: IRoleRepository,
    ) { }

    async execute(userId: string, roleName: string, companyId: string): Promise<User> {
        const user = await this.userRepository.findByIdAndTenant(userId, companyId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const role = await this.roleRepository.findByName(roleName, companyId);
        if (!role) {
            throw new NotFoundException(`Role ${roleName} not found`);
        }

        // Avoid duplicates
        if (!user.roles) user.roles = [];
        if (!user.roles.some(r => r.id === role.id)) {
            user.roles.push(role);
            return await this.userRepository.save(user);
        }

        return user;
    }
}

import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UpdateUserDto } from '../../dto/update-user.dto';
import type { IRoleRepository } from '@modules/roles/domain/repositories/role.repository.interface';
import { handleDatabaseError } from '@common/utils/database-error.handler';

@Injectable()
export class UpdateUserUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
        @Inject('IRoleRepository')
        private readonly roleRepository: IRoleRepository,
    ) { }

    async execute(id: string, dto: UpdateUserDto, companyId?: string): Promise<User> {
        try {
            const { roles, ...userData } = dto;
            const user = companyId
                ? await this.userRepository.findByIdAndTenant(id, companyId)
                : await this.userRepository.findById(id);

            if (!user) {
                throw new NotFoundException('User not found');
            }

            if (roles?.length) {
                const targetCompanyId = companyId || user.activeCompanyId;
                if (!targetCompanyId) {
                    throw new BadRequestException('Cannot assign roles without an active company context');
                }
                user.roles = await this.roleRepository.findManyByNames(roles, targetCompanyId);
                if (user.roles.length !== roles.length) {
                    throw new BadRequestException('One or more roles not found');
                }
            }

            Object.assign(user, userData);
            return await this.userRepository.save(user);
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
            handleDatabaseError(error, 'Email already exists');
            throw error;
        }
    }
}

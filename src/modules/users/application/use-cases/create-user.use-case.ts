import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { CreateUserDto } from '../../dto/create-user.dto';
import type { IRoleRepository } from '@modules/roles/domain/repositories/role.repository.interface';
import type { ICompanyRepository } from '@modules/companies/domain/repositories/company.repository.interface';
import { handleDatabaseError } from '@common/utils/database-error.handler';

@Injectable()
export class CreateUserUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
        @Inject('IRoleRepository')
        private readonly roleRepository: IRoleRepository,
        @Inject('ICompanyRepository')
        private readonly companyRepository: ICompanyRepository,
    ) { }

    async execute(dto: CreateUserDto, companyId?: string): Promise<User> {
        try {
            const { roles, ...userData } = dto;

            const targetCompanyId = companyId || (dto as any).companyId;
            const user = new User();
            Object.assign(user, userData);
            user.setPassword(dto.password);

            if (targetCompanyId) {
                const company = await this.companyRepository.findById(targetCompanyId);
                if (company) {
                    user.companies = [company];
                    user.activeCompanyId = targetCompanyId;
                    user.companyId = targetCompanyId;
                }
            }

            if (roles?.length) {
                if (!user.activeCompanyId) {
                    throw new BadRequestException('Cannot assign roles without an active company context');
                }
                user.roles = await this.roleRepository.findManyByNames(roles, user.activeCompanyId);
                if (user.roles.length !== roles.length) {
                    throw new BadRequestException('One or more roles not found');
                }
            }

            return await this.userRepository.create(user as any);
        } catch (error) {
            if (error instanceof BadRequestException) throw error;
            handleDatabaseError(error, 'Email already exists');
            throw error;
        }
    }
}

import { Injectable, ConflictException, InternalServerErrorException, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import type { IUserRepository } from '@modules/users/domain/repositories/user.repository.interface';
import type { ICompanyRepository } from '@modules/companies/domain/repositories/company.repository.interface';
import type { IRoleRepository } from '@modules/roles/domain/repositories/role.repository.interface';
import type { IPermissionRepository } from '@modules/permissions/domain/repositories/permission.repository.interface';
import { RegisterDto } from '../../dto/register.dto';
import { User } from '@modules/users/domain/entities/user.entity';
import { Company } from '@modules/companies/domain/entities/company.entity';
import { Role } from '@modules/roles/domain/entities/role.entity';
import { Permission } from '@modules/permissions/domain/entities/permission.entity';

@Injectable()
export class RegisterUserUseCase {
    constructor(
        private readonly dataSource: DataSource,
        @Inject('IUserRepository') private readonly userRepo: IUserRepository,
        @Inject('ICompanyRepository') private readonly companyRepo: ICompanyRepository,
        @Inject('IRoleRepository') private readonly roleRepo: IRoleRepository,
        @Inject('IPermissionRepository') private readonly permissionRepo: IPermissionRepository,
    ) { }

    async execute(dto: RegisterDto): Promise<User> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. Check if user exists
            const existingUser = await this.userRepo.findByEmail(dto.email);
            if (existingUser) {
                throw new ConflictException('User already exists');
            }

            // 2. Create Company
            const companyName = dto.companyName || `${dto.name}'s Company`;
            const company = queryRunner.manager.create(Company, {
                name: companyName,
                email: dto.email,
                isActive: true,
            });
            const savedCompany = await queryRunner.manager.save(company);

            // 3. Create User
            const user = queryRunner.manager.create(User, {
                name: dto.name,
                email: dto.email,
                age: dto.age || 0,
                companyId: savedCompany.id,
                activeCompanyId: savedCompany.id,
                companies: [savedCompany],
            });
            user.setPassword(dto.password);
            const savedUser = await queryRunner.manager.save(user);

            // 4. Create/Assign Initial Role (e.g., Admin)
            const adminRole = queryRunner.manager.create(Role, {
                name: 'Admin',
                companyId: savedCompany.id,
            });

            // 4.1 Create/Assign baseline permissions for Admin
            const permissionsNeeded = ['read.dashboard', 'read.users', 'read.reports'];
            const permissions: Permission[] = [];
            for (const slug of permissionsNeeded) {
                let perm = await queryRunner.manager.findOne(Permission, { where: { slug } });
                if (!perm) {
                    perm = queryRunner.manager.create(Permission, { slug, description: `Allow ${slug}` });
                    await queryRunner.manager.save(perm);
                }
                permissions.push(perm);
            }
            adminRole.permissions = permissions;
            const savedRole = await queryRunner.manager.save(adminRole);

            // 5. Link role to user
            savedUser.roles = [savedRole as any];
            await queryRunner.manager.save(savedUser);

            await queryRunner.commitTransaction();
            return savedUser;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            if (error instanceof ConflictException) throw error;
            throw new InternalServerErrorException(error.message);
        } finally {
            await queryRunner.release();
        }
    }
}

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '@modules/users/domain/entities/user.entity';
import { Role } from '@modules/roles/domain/entities/role.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { UserQueryDto } from '../dto/user-query.dto';
import { createPaginatedResponse } from '@common/dto/pagination.dto';
import { handleDatabaseError } from '@common/utils/database-error.handler';
import { successResponse } from '@common/dto/response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) { }

  // ==================== CRUD Operations ====================

  async create(dto: CreateUserDto, companyId?: string) {
    try {
      const { roles, ...userData } = dto;
      const user = this.userRepo.create(userData);

      const targetCompanyId = companyId || (dto as any).companyId;
      if (targetCompanyId) {
        user.activeCompanyId = targetCompanyId;
        user.companyId = targetCompanyId;
      }

      if (roles?.length) {
        if (!user.activeCompanyId) {
          throw new BadRequestException('Cannot assign roles without an active company context');
        }
        user.roles = await this.findRolesByName(roles, user.activeCompanyId);
      }

      const savedUser = await this.userRepo.save(user);

      if (targetCompanyId) {
        await this.userRepo.createQueryBuilder()
          .relation(User, 'companies')
          .of(savedUser)
          .add(targetCompanyId);
      }

      return savedUser;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      handleDatabaseError(error, 'Email already exists');
    }
  }

  async findAll(query: UserQueryDto, companyId?: string) {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      status,
      sortBy = 'id',
      sortOrder = 'ASC',
    } = query;

    const qb = this.userRepo.createQueryBuilder('user');
    qb.leftJoinAndSelect('user.roles', 'roles');

    if (companyId) {
      qb.innerJoin('user.companies', 'company', 'company.id = :companyId', { companyId });
    }

    if (search) {
      qb.andWhere('(user.name ILIKE :search OR user.email ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (role) {
      qb.andWhere('roles.name = :role', { role });
    }

    if (status) {
      qb.andWhere('user.status = :status', { status });
    }

    if (sortBy) {
      qb.orderBy(`user.${sortBy}`, sortOrder);
    }

    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return createPaginatedResponse(items, total, page, limit);
  }

  async findOne(id: string, companyId?: string) {
    const whereCondition: any = { id };
    if (companyId) {
      whereCondition.activeCompanyId = companyId; // Use activeCompanyId for strict matching
    }

    const user = await this.userRepo.findOne({
      where: whereCondition,
      relations: ['roles', 'roles.permissions', 'companies'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto, companyId?: string) {
    try {
      const { roles, password, ...rest } = dto;

      const user = await this.findOne(id, companyId);

      if (password) {
        throw new BadRequestException(
          'Use the change password endpoint to update password',
        );
      }

      if (Object.keys(rest).length) {
        await this.userRepo.update(id, rest);
      }

      if (roles) {
        // Use the companyId from user object (verified by findOne)
        user.roles = await this.findRolesByName(roles, user.activeCompanyId);
        await this.userRepo.save(user);
      }

      return this.findOne(id, companyId);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      handleDatabaseError(error, 'Email already exists');
    }
  }

  async remove(id: string, companyId?: string) {
    const user = await this.findOne(id, companyId);

    await this.userRepo.softDelete(id);
    return successResponse('User deleted successfully');
  }

  // ==================== Role Management ====================

  async assignRole(userId: string, roleName: string, companyId: string) {
    const user = await this.findOne(userId, companyId);

    const role = await this.roleRepo.findOne({
      where: {
        name: roleName,
        companyId: companyId
      }
    });

    if (!role) {
      throw new NotFoundException(`Role '${roleName}' not found in company context`);
    }

    user.roles = user.roles || [];

    if (!user.roles.some((r) => r.id === role.id)) {
      user.roles.push(role);
      await this.userRepo.save(user);
    }

    return user;
  }

  // ==================== Authentication Helpers ====================

  findByEmailForAuth(email: string) {
    return this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .leftJoinAndSelect(
        'user.roles',
        'roles',
        'roles.company_id = user.active_company_id'
      )
      .leftJoinAndSelect('roles.permissions', 'permissions')
      .getOne();
  }

  async incrementFailedAttempts(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (user) {
      user.incrementFailedAttempts();
      await this.userRepo.save(user);
    }
  }

  async resetFailedAttempts(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (user) {
      user.resetFailedAttempts();
      await this.userRepo.save(user);
    }
  }

  async updateLastLogin(userId: string) {
    await this.userRepo.update(userId, { lastLoginAt: new Date() });
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!user) throw new NotFoundException('User not found');

    const isValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isValid) throw new BadRequestException('Invalid current password');

    user.password = dto.newPassword; // Will be hashed via @BeforeUpdate in entity
    await this.userRepo.save(user);

    return { message: 'Password changed successfully' };
  }

  // ==================== Private Helpers ====================

  private async findRolesByName(roleNames: string[], companyId: string): Promise<Role[]> {
    const roles = await this.roleRepo.find({
      where: {
        name: In(roleNames),
        companyId: companyId
      },
    });

    if (roles.length !== roleNames.length) {
      // Find which are missing for better error
      const foundNames = roles.map(r => r.name);
      const missing = roleNames.filter(n => !foundNames.includes(n));
      throw new NotFoundException(`Roles not found in company context: ${missing.join(', ')}`);
    }

    return roles;
  }
}

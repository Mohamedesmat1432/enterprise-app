import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { Role } from '@modules/roles/entities/role.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
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

  async create(dto: CreateUserDto) {
    try {
      const { roles, ...userData } = dto;
      const user = this.userRepo.create(userData);

      if (roles?.length) {
        user.roles = await this.findRolesByName(roles);
      }

      return await this.userRepo.save(user);
    } catch (error) {
      handleDatabaseError(error, 'Email already exists');
    }
  }

  findAll() {
    return this.userRepo.find({ relations: ['roles'] });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    try {
      const { roles, password, ...rest } = dto;

      // Validate user exists
      const user = await this.findOne(id);

      // Prevent password updates via this method
      if (password) {
        throw new BadRequestException(
          'Use the change password endpoint to update password',
        );
      }

      // Update basic fields if any
      if (Object.keys(rest).length) {
        await this.userRepo.update(id, rest);
      }

      // Update roles if provided
      if (roles) {
        user.roles = await this.findRolesByName(roles);
        await this.userRepo.save(user);
      }

      return this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      handleDatabaseError(error, 'Email already exists');
    }
  }

  async remove(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepo.softDelete(id);
    return successResponse('User deleted successfully');
  }

  // ==================== Role Management ====================

  async assignRole(userId: number, roleName: string) {
    const user = await this.findOne(userId);
    const role = await this.roleRepo.findOne({ where: { name: roleName } });

    if (!role) {
      throw new NotFoundException(`Role '${roleName}' not found`);
    }

    user.roles = user.roles || [];

    // Avoid duplicate assignment
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
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('roles.permissions', 'permissions')
      .getOne();
  }

  async incrementFailedAttempts(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (user) {
      user.incrementFailedAttempts();
      await this.userRepo.save(user);
    }
  }

  async resetFailedAttempts(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (user) {
      user.resetFailedAttempts();
      await this.userRepo.save(user);
    }
  }

  async updateLastLogin(userId: number) {
    await this.userRepo.update(userId, { lastLoginAt: new Date() });
  }

  // ==================== Password Management ====================

  async changePassword(userId: number, dto: ChangePasswordDto) {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('New passwords do not match');
    }

    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id: userId })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    user.setPassword(dto.newPassword);
    await this.userRepo.save(user);

    return successResponse('Password changed successfully');
  }

  // ==================== Private Helpers ====================

  private async findRolesByName(roleNames: string[]): Promise<Role[]> {
    const roles = await this.roleRepo.find({
      where: { name: In(roleNames) },
    });

    if (roles.length !== roleNames.length) {
      throw new NotFoundException('One or more roles not found');
    }

    return roles;
  }
}

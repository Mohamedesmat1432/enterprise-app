import { UsersService } from '@modules/users/services/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSession } from '@modules/auth/domain/entities/user-session.entity';
import { CompaniesService } from '@modules/companies/services/companies.service';
import { RolesService } from '@modules/roles/services/roles.service';
import {
  Injectable,
  UnauthorizedException,
  Logger,
  ForbiddenException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PermissionsService } from '@modules/permissions/services/permissions.service';
import { RegisterDto } from '../dto/register.dto';
import type { IUserRepository } from '@modules/users/domain/repositories/user.repository.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject('IUserRepository')
    private userRepo: IUserRepository,
    private companiesService: CompaniesService,
    private rolesService: RolesService,
    private permissionsService: PermissionsService,
    private jwtService: JwtService,
    @InjectRepository(UserSession)
    private sessionRepo: Repository<UserSession>,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepo.findByEmailWithAuth(email);

    if (!user) {
      this.logger.warn(`Login attempt for non-existent user: ${email}`);
      return null;
    }

    // Check if account is locked
    if (user.isLocked()) {
      this.logger.warn(`Login attempt for locked account: ${email}`);
      user.incrementFailedAttempts();
      await this.userRepo.save(user);
      throw new UnauthorizedException(
        'Account is locked due to multiple failed login attempts. Please try again later.',
      );
    }

    // Check if account is disabled
    if (user.status === 'disabled') {
      this.logger.warn(`Login attempt for disabled account: ${email}`);
      throw new UnauthorizedException('Account is disabled.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (!isPasswordValid) {
      this.logger.warn(`Failed login attempt for user: ${email}`);
      user.incrementFailedAttempts();
      await this.userRepo.save(user);
      return null;
    }

    // Successful login - reset failed attempts and update last login
    user.resetFailedAttempts();
    user.lastLoginAt = new Date();
    await this.userRepo.save(user);

    this.logger.log(`Successful login for user: ${email}`);

    const { password, ...result } = user;
    return result;
  }

  async login(user: any, requestInfo?: { ip: string; userAgent: string }) {
    const payload = {
      username: user.name,
      sub: user.id,
      email: user.email,
      roles: user.roles?.map((r) => r.name) || [],
      companyId: user.activeCompanyId,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '7d' }, // Refresh token valid for 7 days
    );

    if (requestInfo) {
      await this.createSession(user.id, refreshToken, requestInfo.ip, requestInfo.userAgent);
    }

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        activeCompanyId: user.activeCompanyId,
      },
    };
  }

  async createSession(userId: string, refreshToken: string, ip: string, userAgent: string) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const session = this.sessionRepo.create({
      userId,
      refreshToken, // In production, hash this!
      ipAddress: ip,
      userAgent: userAgent,
      expiresAt,
    });
    return await this.sessionRepo.save(session);
  }

  async refreshTokens(refreshToken: string, ip: string, userAgent: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const session = await this.sessionRepo.findOne({
        where: { refreshToken, isRevoked: false },
        relations: ['user', 'user.roles'],
      });

      if (!session || session.userId !== payload.sub || session.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      // Revoke old session (Token Rotation)
      session.isRevoked = true;
      await this.sessionRepo.save(session);

      // Create new session
      return this.login(session.user, { ip, userAgent });
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string) {
    const session = await this.sessionRepo.findOne({ where: { refreshToken } });
    if (session) {
      session.isRevoked = true;
      await this.sessionRepo.save(session);
    }
  }

  async switchCompany(userId: string, companyId: string) {
    const user = await this.userRepo.findById(userId, ['companies']);
    if (!user) throw new UnauthorizedException('User not found');

    // Verify user has membership in the target company
    const isMember = user.companies?.some((c) => c.id === companyId);
    if (!isMember) {
      throw new ForbiddenException('You do not have access to this company');
    }

    // We update the active company session
    user.activeCompanyId = companyId;
    await this.userRepo.save(user);

    const updatedUser = await this.userRepo.findByEmailWithAuth(user.email);
    return this.login(updatedUser);
  }

}

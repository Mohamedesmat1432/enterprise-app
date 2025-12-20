import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserSession } from '../domain/entities/user-session.entity';
import { CompaniesService } from '@modules/companies/services/companies.service';
import { RolesService } from '@modules/roles/services/roles.service';
import { PermissionsService } from '@modules/permissions/services/permissions.service';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';

describe('AuthService', () => {
    let service: AuthService;
    let userRepo: any;
    let sessionRepo: any;
    let jwtService: jest.Mocked<JwtService>;

    const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        password: '$2b$10$hashedpassword',
        activeCompanyId: 'company-1',
        roles: [{ name: 'Admin' }],
        companies: [{ id: 'company-1' }, { id: 'company-2' }],
        isLocked: jest.fn().mockReturnValue(false),
        incrementFailedAttempts: jest.fn(),
        resetFailedAttempts: jest.fn(),
        status: 'active',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: 'IUserRepository',
                    useValue: {
                        findByEmailWithAuth: jest.fn(),
                        findById: jest.fn(),
                        save: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(UserSession),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        findOne: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(),
                        verify: jest.fn(),
                    },
                },
                { provide: CompaniesService, useValue: {} },
                { provide: RolesService, useValue: {} },
                { provide: PermissionsService, useValue: {} },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        userRepo = module.get('IUserRepository');
        sessionRepo = module.get(getRepositoryToken(UserSession));
        jwtService = module.get(JwtService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('validateUser', () => {
        it('should return user without password on valid credentials', async () => {
            const bcrypt = require('bcrypt');
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
            userRepo.findByEmailWithAuth.mockResolvedValue(mockUser);
            userRepo.save.mockResolvedValue(mockUser);

            const result = await service.validateUser('test@example.com', 'password123');

            expect(result).toBeDefined();
            expect(result.password).toBeUndefined();
        });

        it('should return null for non-existent user', async () => {
            userRepo.findByEmailWithAuth.mockResolvedValue(null);

            const result = await service.validateUser('nonexistent@example.com', 'password');

            expect(result).toBeNull();
        });

        it('should throw UnauthorizedException for locked account', async () => {
            const lockedUser = { ...mockUser, isLocked: jest.fn().mockReturnValue(true) };
            userRepo.findByEmailWithAuth.mockResolvedValue(lockedUser);
            userRepo.save.mockResolvedValue(lockedUser);

            await expect(service.validateUser('test@example.com', 'password'))
                .rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException for disabled account', async () => {
            const disabledUser = { ...mockUser, status: 'disabled' };
            userRepo.findByEmailWithAuth.mockResolvedValue(disabledUser);

            await expect(service.validateUser('test@example.com', 'password'))
                .rejects.toThrow(UnauthorizedException);
        });
    });

    describe('login', () => {
        it('should return access and refresh tokens', async () => {
            jwtService.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');

            const result = await service.login(mockUser);

            expect(result.access_token).toBe('access-token');
            expect(result.refresh_token).toBe('refresh-token');
            expect(result.user.id).toBe('user-1');
        });

        it('should create session when request info is provided', async () => {
            jwtService.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');
            sessionRepo.create.mockReturnValue({});
            sessionRepo.save.mockResolvedValue({});

            await service.login(mockUser, { ip: '127.0.0.1', userAgent: 'Mozilla' });

            expect(sessionRepo.create).toHaveBeenCalled();
            expect(sessionRepo.save).toHaveBeenCalled();
        });
    });

    describe('logout', () => {
        it('should revoke the session', async () => {
            const session = { isRevoked: false };
            sessionRepo.findOne.mockResolvedValue(session);
            sessionRepo.save.mockResolvedValue({ ...session, isRevoked: true });

            await service.logout('refresh-token');

            expect(session.isRevoked).toBe(true);
            expect(sessionRepo.save).toHaveBeenCalledWith(session);
        });
    });

    describe('switchCompany', () => {
        it('should switch company for authorized user', async () => {
            userRepo.findById.mockResolvedValue(mockUser);
            userRepo.save.mockResolvedValue({ ...mockUser, activeCompanyId: 'company-2' });
            userRepo.findByEmailWithAuth.mockResolvedValue({ ...mockUser, activeCompanyId: 'company-2' });
            jwtService.sign.mockReturnValue('new-token');

            const result = await service.switchCompany('user-1', 'company-2');

            expect(result.access_token).toBe('new-token');
        });

        it('should throw ForbiddenException for unauthorized company', async () => {
            userRepo.findById.mockResolvedValue(mockUser);

            await expect(service.switchCompany('user-1', 'unauthorized-company'))
                .rejects.toThrow(ForbiddenException);
        });
    });
});

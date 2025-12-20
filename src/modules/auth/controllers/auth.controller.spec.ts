import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { RegisterUserUseCase } from '../application/use-cases/register-user.use-case';

describe('AuthController', () => {
    let controller: AuthController;
    let authService: jest.Mocked<AuthService>;
    let loginUseCase: jest.Mocked<LoginUseCase>;
    let registerUserUseCase: jest.Mocked<RegisterUserUseCase>;

    const mockRequest = { user: { userId: 'user-1', companyId: 'company-1' } };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        login: jest.fn(),
                        refreshTokens: jest.fn(),
                        logout: jest.fn(),
                        switchCompany: jest.fn(),
                    },
                },
                { provide: LoginUseCase, useValue: { execute: jest.fn() } },
                { provide: RegisterUserUseCase, useValue: { execute: jest.fn() } },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get(AuthService);
        loginUseCase = module.get(LoginUseCase);
        registerUserUseCase = module.get(RegisterUserUseCase);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('login', () => {
        it('should authenticate user and return tokens', async () => {
            const loginDto = { email: 'test@example.com', password: 'password123' };
            const user = { id: '1', email: 'test@example.com', name: 'Test User' };
            const tokens = { access_token: 'jwt', refresh_token: 'refresh', user };

            loginUseCase.execute.mockResolvedValue(user as any);
            authService.login.mockResolvedValue(tokens as any);

            const result = await controller.login(loginDto, '127.0.0.1', 'Mozilla/5.0');

            expect(loginUseCase.execute).toHaveBeenCalledWith(loginDto);
            expect(authService.login).toHaveBeenCalledWith(user, { ip: '127.0.0.1', userAgent: 'Mozilla/5.0' });
            expect(result).toEqual(tokens);
        });
    });

    describe('register', () => {
        it('should register a new user', async () => {
            const registerDto = {
                name: 'New User',
                email: 'new@example.com',
                password: 'Password123!',
                companyName: 'New Company',
                age: 25,
            };
            const expected = { id: '1', email: 'new@example.com' };
            registerUserUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.register(registerDto);

            expect(registerUserUseCase.execute).toHaveBeenCalledWith(registerDto);
            expect(result).toEqual(expected);
        });
    });

    describe('refresh', () => {
        it('should refresh tokens', async () => {
            const refreshToken = 'old-refresh-token';
            const expected = { access_token: 'new-jwt', refresh_token: 'new-refresh' };
            authService.refreshTokens.mockResolvedValue(expected as any);

            const result = await controller.refresh(refreshToken, '127.0.0.1', 'Mozilla/5.0');

            expect(authService.refreshTokens).toHaveBeenCalledWith(refreshToken, '127.0.0.1', 'Mozilla/5.0');
            expect(result).toEqual(expected);
        });
    });

    describe('logout', () => {
        it('should revoke refresh token', async () => {
            const refreshToken = 'refresh-token';
            authService.logout.mockResolvedValue(undefined);

            const result = await controller.logout(refreshToken);

            expect(authService.logout).toHaveBeenCalledWith(refreshToken);
            expect(result).toEqual({ message: 'Logged out successfully' });
        });
    });

    describe('switchCompany', () => {
        it('should switch user active company', async () => {
            const companyId = 'new-company-id';
            const expected = { access_token: 'new-jwt', user: { activeCompanyId: companyId } };
            authService.switchCompany.mockResolvedValue(expected as any);

            const result = await controller.switchCompany(companyId, mockRequest);

            expect(authService.switchCompany).toHaveBeenCalledWith('user-1', companyId);
            expect(result).toEqual(expected);
        });
    });
});

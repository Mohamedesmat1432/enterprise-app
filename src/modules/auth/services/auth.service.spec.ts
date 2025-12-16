import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '@modules/users/services/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: {
                        findByEmailForAuth: jest.fn(),
                        create: jest.fn(),
                        assignRole: jest.fn(),
                        incrementFailedAttempts: jest.fn(),
                        resetFailedAttempts: jest.fn(),
                        updateLastLogin: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

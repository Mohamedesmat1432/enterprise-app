import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Role } from '@modules/roles/entities/role.entity';
import { Repository } from 'typeorm';

describe('UsersService', () => {
    let service: UsersService;
    let userRepo: Repository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        find: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        softDelete: jest.fn(),
                        createQueryBuilder: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(Role),
                    useValue: {
                        findOne: jest.fn(),
                        find: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

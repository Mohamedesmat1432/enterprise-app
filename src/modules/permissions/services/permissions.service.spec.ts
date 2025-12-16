import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from './permissions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Permission } from '../entities/permission.entity';
import { Repository } from 'typeorm';

describe('PermissionsService', () => {
    let service: PermissionsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PermissionsService,
                {
                    provide: getRepositoryToken(Permission),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        find: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<PermissionsService>(PermissionsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

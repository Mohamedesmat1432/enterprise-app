import { Test, TestingModule } from '@nestjs/testing';
import { AuditLogsService } from './audit-logs.service';
import { CreateAuditLogUseCase } from '../application/use-cases/create-audit-log.use-case';
import { GetAuditLogsUseCase } from '../application/use-cases/get-audit-logs.use-case';

describe('AuditLogsService', () => {
    let service: AuditLogsService;
    let createAuditLogUseCase: jest.Mocked<CreateAuditLogUseCase>;
    let getAuditLogsUseCase: jest.Mocked<GetAuditLogsUseCase>;

    const mockAuditLog = {
        id: 'log-1',
        companyId: 'company-1',
        userId: 'user-1',
        action: 'CREATE',
        entity: 'User',
        entityId: 'user-2',
        changes: { name: 'New User' },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuditLogsService,
                {
                    provide: CreateAuditLogUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: GetAuditLogsUseCase,
                    useValue: { execute: jest.fn() },
                },
            ],
        }).compile();

        service = module.get<AuditLogsService>(AuditLogsService);
        createAuditLogUseCase = module.get(CreateAuditLogUseCase);
        getAuditLogsUseCase = module.get(GetAuditLogsUseCase);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should delegate to CreateAuditLogUseCase', async () => {
            createAuditLogUseCase.execute.mockResolvedValue(mockAuditLog as any);

            const result = await service.create(
                'company-1',
                'user-1',
                'CREATE',
                'User',
                'user-2',
                { name: 'New User' },
            );

            expect(createAuditLogUseCase.execute).toHaveBeenCalledWith(
                'company-1',
                'user-1',
                'CREATE',
                'User',
                'user-2',
                { name: 'New User' },
            );
            expect(result).toEqual(mockAuditLog);
        });
    });

    describe('findAll', () => {
        it('should delegate to GetAuditLogsUseCase with pagination', async () => {
            const logs = [mockAuditLog];
            const expected = {
                data: logs,
                meta: { total: 1, page: 1, limit: 10, totalPages: 1, hasNext: false, hasPrev: false }
            };
            getAuditLogsUseCase.execute.mockResolvedValue(expected as any);

            const result = await service.findAll('company-1');

            expect(getAuditLogsUseCase.execute).toHaveBeenCalledWith('company-1', 1, 10);
            expect(result).toEqual(expected);
        });
    });
});

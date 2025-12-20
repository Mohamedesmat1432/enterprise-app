import { Test, TestingModule } from '@nestjs/testing';
import { AuditLogsController } from './audit-logs.controller';
import { GetAuditLogsUseCase } from '../application/use-cases/get-audit-logs.use-case';

describe('AuditLogsController', () => {
    let controller: AuditLogsController;
    let getAuditLogsUseCase: jest.Mocked<GetAuditLogsUseCase>;

    const mockRequest = { user: { companyId: 'company-1' } };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuditLogsController],
            providers: [
                { provide: GetAuditLogsUseCase, useValue: { execute: jest.fn() } },
            ],
        }).compile();

        controller = module.get<AuditLogsController>(AuditLogsController);
        getAuditLogsUseCase = module.get(GetAuditLogsUseCase);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll', () => {
        it('should return all audit logs', async () => {
            const auditLogs = [
                { id: '1', action: 'CREATE', entity: 'User', entityId: 'user-1' },
                { id: '2', action: 'UPDATE', entity: 'Product', entityId: 'prod-1' },
            ];
            const expected = {
                data: auditLogs,
                meta: { total: 2, page: 1, limit: 10, totalPages: 1, hasNext: false, hasPrev: false }
            };
            getAuditLogsUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.findAll(mockRequest);

            expect(getAuditLogsUseCase.execute).toHaveBeenCalledWith('company-1', 1, 10);
            expect(result).toEqual(expected);
        });
    });
});

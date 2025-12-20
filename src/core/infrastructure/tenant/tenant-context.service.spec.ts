import { Test, TestingModule } from '@nestjs/testing';
import { TenantContextService } from './tenant-context.service';

describe('TenantContextService', () => {
    let service: TenantContextService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TenantContextService],
        }).compile();

        service = await module.resolve<TenantContextService>(TenantContextService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should set and get tenantId and userId', () => {
        service.setContext('tenant-1', 'user-1');
        expect(service.getTenantId()).toBe('tenant-1');
        expect(service.getUserId()).toBe('user-1');
        expect(service.hasContext()).toBe(true);
    });

    it('should throw error if tenantId is not set', () => {
        expect(() => service.getTenantId()).toThrow('Tenant context not set');
    });

    it('should throw error if userId is not set', () => {
        expect(() => service.getUserId()).toThrow('User context not set');
    });
});

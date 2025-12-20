import { Test, TestingModule } from '@nestjs/testing';
import { TaxesService } from './taxes.service';
import { CreateTaxUseCase } from '../application/use-cases/create-tax.use-case';
import { GetTaxesUseCase } from '../application/use-cases/get-taxes.use-case';
import { GetTaxUseCase } from '../application/use-cases/get-tax.use-case';

describe('TaxesService', () => {
    let service: TaxesService;
    let createTaxUseCase: jest.Mocked<CreateTaxUseCase>;
    let getTaxesUseCase: jest.Mocked<GetTaxesUseCase>;
    let getTaxUseCase: jest.Mocked<GetTaxUseCase>;

    const companyId = 'company-1';

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TaxesService,
                { provide: CreateTaxUseCase, useValue: { execute: jest.fn() } },
                { provide: GetTaxesUseCase, useValue: { execute: jest.fn(), getSalesTaxes: jest.fn(), getPurchaseTaxes: jest.fn() } },
                { provide: GetTaxUseCase, useValue: { execute: jest.fn() } },
            ],
        }).compile();

        service = module.get<TaxesService>(TaxesService);
        createTaxUseCase = module.get(CreateTaxUseCase);
        getTaxesUseCase = module.get(GetTaxesUseCase);
        getTaxUseCase = module.get(GetTaxUseCase);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should delegate to CreateTaxUseCase', async () => {
            const dto = { name: 'VAT 15%', amount: 15, type: 'percent' as const };
            const expected = { id: '1', ...dto };
            createTaxUseCase.execute.mockResolvedValue(expected as any);

            const result = await service.create(companyId, dto);

            expect(createTaxUseCase.execute).toHaveBeenCalledWith(companyId, dto);
            expect(result).toEqual(expected);
        });
    });

    describe('findAll', () => {
        it('should return all taxes when no type specified', async () => {
            const expected = [{ id: '1', name: 'VAT' }];
            getTaxesUseCase.execute.mockResolvedValue(expected as any);

            const result = await service.findAll(companyId);

            expect(getTaxesUseCase.execute).toHaveBeenCalled();
            expect(result).toEqual(expected);
        });

        it('should return sales taxes when type is sale', async () => {
            const expected = [{ id: '1', name: 'Sales Tax', isSale: true }];
            getTaxesUseCase.getSalesTaxes.mockResolvedValue(expected as any);

            const result = await service.findAll(companyId, 'sale');

            expect(getTaxesUseCase.getSalesTaxes).toHaveBeenCalledWith(companyId);
            expect(result).toEqual(expected);
        });

        it('should return purchase taxes when type is purchase', async () => {
            const expected = [{ id: '1', name: 'Purchase Tax', isPurchase: true }];
            getTaxesUseCase.getPurchaseTaxes.mockResolvedValue(expected as any);

            const result = await service.findAll(companyId, 'purchase');

            expect(getTaxesUseCase.getPurchaseTaxes).toHaveBeenCalledWith(companyId);
            expect(result).toEqual(expected);
        });
    });

    describe('findOne', () => {
        it('should delegate to GetTaxUseCase', async () => {
            const expected = { id: '1', name: 'VAT 15%', amount: 15 };
            getTaxUseCase.execute.mockResolvedValue(expected as any);

            const result = await service.findOne('1', companyId);

            expect(getTaxUseCase.execute).toHaveBeenCalledWith('1', companyId);
            expect(result).toEqual(expected);
        });
    });
});

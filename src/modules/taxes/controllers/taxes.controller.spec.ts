import { Test, TestingModule } from '@nestjs/testing';
import { TaxesController } from './taxes.controller';
import { TaxesService } from '../services/taxes.service';

describe('TaxesController', () => {
    let controller: TaxesController;
    let taxesService: jest.Mocked<TaxesService>;

    const mockRequest = { user: { companyId: 'company-1' } };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TaxesController],
            providers: [
                {
                    provide: TaxesService,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<TaxesController>(TaxesController);
        taxesService = module.get(TaxesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a tax', async () => {
            const dto = { name: 'VAT 15%', amount: 15, type: 'percent' as const };
            const expected = { id: '1', ...dto };
            taxesService.create.mockResolvedValue(expected as any);

            const result = await controller.create(mockRequest, dto);

            expect(taxesService.create).toHaveBeenCalledWith('company-1', dto);
            expect(result).toEqual(expected);
        });
    });

    describe('findAll', () => {
        it('should return all taxes', async () => {
            const expected = [{ id: '1', name: 'VAT 15%' }];
            taxesService.findAll.mockResolvedValue(expected as any);

            const result = await controller.findAll(mockRequest);

            expect(taxesService.findAll).toHaveBeenCalledWith('company-1', undefined);
            expect(result).toEqual(expected);
        });

        it('should filter taxes by type', async () => {
            const expected = [{ id: '1', name: 'Sales Tax', isSale: true }];
            taxesService.findAll.mockResolvedValue(expected as any);

            const result = await controller.findAll(mockRequest, 'sale');

            expect(taxesService.findAll).toHaveBeenCalledWith('company-1', 'sale');
            expect(result).toEqual(expected);
        });
    });

    describe('findOne', () => {
        it('should return a tax by id', async () => {
            const expected = { id: '1', name: 'VAT 15%', amount: 15 };
            taxesService.findOne.mockResolvedValue(expected as any);

            const result = await controller.findOne(mockRequest, '1');

            expect(taxesService.findOne).toHaveBeenCalledWith('1', 'company-1');
            expect(result).toEqual(expected);
        });
    });
});

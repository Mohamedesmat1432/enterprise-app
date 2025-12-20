import { Test, TestingModule } from '@nestjs/testing';
import { UomController } from './uom.controller';
import { UomService } from '../services/uom.service';

describe('UomController', () => {
    let controller: UomController;
    let uomService: jest.Mocked<UomService>;

    const mockRequest = { user: { companyId: 'company-1' } };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UomController],
            providers: [
                {
                    provide: UomService,
                    useValue: {
                        createCategory: jest.fn(),
                        findAllCategories: jest.fn(),
                        createUom: jest.fn(),
                        findAllUoms: jest.fn(),
                        findOneUom: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<UomController>(UomController);
        uomService = module.get(UomService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('createCategory', () => {
        it('should create a UOM category', async () => {
            const dto = { name: 'Weight' };
            const expected = { id: '1', ...dto };
            uomService.createCategory.mockResolvedValue(expected as any);

            const result = await controller.createCategory(dto as any, mockRequest);

            expect(uomService.createCategory).toHaveBeenCalledWith(dto, 'company-1');
            expect(result).toEqual(expected);
        });
    });

    describe('findAllCategories', () => {
        it('should return all UOM categories', async () => {
            const expected = [{ id: '1', name: 'Weight' }];
            uomService.findAllCategories.mockResolvedValue(expected as any);

            const result = await controller.findAllCategories(mockRequest);

            expect(uomService.findAllCategories).toHaveBeenCalledWith('company-1');
            expect(result).toEqual(expected);
        });
    });

    describe('createUom', () => {
        it('should create a UOM', async () => {
            const dto = { name: 'Kilogram', categoryId: 'cat-1', ratio: 1 };
            const expected = { id: '1', ...dto };
            uomService.createUom.mockResolvedValue(expected as any);

            const result = await controller.createUom(dto as any, mockRequest);

            expect(uomService.createUom).toHaveBeenCalledWith(dto, 'company-1');
            expect(result).toEqual(expected);
        });
    });

    describe('findAllUoms', () => {
        it('should return all UOMs', async () => {
            const expected = [{ id: '1', name: 'Kilogram' }];
            uomService.findAllUoms.mockResolvedValue(expected as any);

            const result = await controller.findAllUoms(mockRequest);

            expect(uomService.findAllUoms).toHaveBeenCalledWith('company-1');
            expect(result).toEqual(expected);
        });
    });

    describe('findOne', () => {
        it('should return a UOM by id', async () => {
            const expected = { id: '1', name: 'Kilogram', ratio: 1 };
            uomService.findOneUom.mockResolvedValue(expected as any);

            const result = await controller.findOne('1', mockRequest);

            expect(uomService.findOneUom).toHaveBeenCalledWith('1', 'company-1');
            expect(result).toEqual(expected);
        });
    });
});

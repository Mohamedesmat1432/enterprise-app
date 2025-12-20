import { Test, TestingModule } from '@nestjs/testing';
import { UomService } from './uom.service';
import { CreateUomUseCase } from '../application/use-cases/create-uom.use-case';
import { CreateUomCategoryUseCase } from '../application/use-cases/create-uom-category.use-case';
import { GetUomsUseCase } from '../application/use-cases/get-uoms.use-case';
import { GetUomCategoriesUseCase } from '../application/use-cases/get-uom-categories.use-case';
import { GetUomUseCase } from '../application/use-cases/get-uom.use-case';

describe('UomService', () => {
    let service: UomService;
    let createUomUseCase: jest.Mocked<CreateUomUseCase>;
    let createCategoryUseCase: jest.Mocked<CreateUomCategoryUseCase>;
    let getUomsUseCase: jest.Mocked<GetUomsUseCase>;
    let getCategoriesUseCase: jest.Mocked<GetUomCategoriesUseCase>;
    let getUomUseCase: jest.Mocked<GetUomUseCase>;

    const companyId = 'company-1';

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UomService,
                { provide: CreateUomUseCase, useValue: { execute: jest.fn() } },
                { provide: CreateUomCategoryUseCase, useValue: { execute: jest.fn() } },
                { provide: GetUomsUseCase, useValue: { execute: jest.fn() } },
                { provide: GetUomCategoriesUseCase, useValue: { execute: jest.fn() } },
                { provide: GetUomUseCase, useValue: { execute: jest.fn() } },
            ],
        }).compile();

        service = module.get<UomService>(UomService);
        createUomUseCase = module.get(CreateUomUseCase);
        createCategoryUseCase = module.get(CreateUomCategoryUseCase);
        getUomsUseCase = module.get(GetUomsUseCase);
        getCategoriesUseCase = module.get(GetUomCategoriesUseCase);
        getUomUseCase = module.get(GetUomUseCase);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createCategory', () => {
        it('should delegate to CreateUomCategoryUseCase', async () => {
            const dto = { name: 'Weight' };
            const expected = { id: '1', ...dto };
            createCategoryUseCase.execute.mockResolvedValue(expected as any);

            const result = await service.createCategory(dto, companyId);

            expect(createCategoryUseCase.execute).toHaveBeenCalledWith(dto, companyId);
            expect(result).toEqual(expected);
        });
    });

    describe('findAllCategories', () => {
        it('should delegate to GetUomCategoriesUseCase', async () => {
            const expected = [{ id: '1', name: 'Weight' }];
            getCategoriesUseCase.execute.mockResolvedValue(expected as any);

            const result = await service.findAllCategories(companyId);

            expect(getCategoriesUseCase.execute).toHaveBeenCalled();
            expect(result).toEqual(expected);
        });
    });

    describe('createUom', () => {
        it('should delegate to CreateUomUseCase', async () => {
            const dto = { name: 'Kilogram', categoryId: 'cat-1', ratio: 1, isReference: true };
            const expected = { id: '1', ...dto };
            createUomUseCase.execute.mockResolvedValue(expected as any);

            const result = await service.createUom(dto, companyId);

            expect(createUomUseCase.execute).toHaveBeenCalledWith(dto, companyId);
            expect(result).toEqual(expected);
        });
    });

    describe('findAllUoms', () => {
        it('should delegate to GetUomsUseCase', async () => {
            const expected = [{ id: '1', name: 'Kilogram' }];
            getUomsUseCase.execute.mockResolvedValue(expected as any);

            const result = await service.findAllUoms(companyId);

            expect(getUomsUseCase.execute).toHaveBeenCalled();
            expect(result).toEqual(expected);
        });
    });

    describe('findOneUom', () => {
        it('should delegate to GetUomUseCase', async () => {
            const expected = { id: '1', name: 'Kilogram', ratio: 1 };
            getUomUseCase.execute.mockResolvedValue(expected as any);

            const result = await service.findOneUom('1', companyId);

            expect(getUomUseCase.execute).toHaveBeenCalledWith('1', companyId);
            expect(result).toEqual(expected);
        });
    });
});

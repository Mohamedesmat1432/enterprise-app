import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import { CreateCompanyUseCase } from '../application/use-cases/create-company.use-case';
import { GetCompaniesUseCase } from '../application/use-cases/get-companies.use-case';
import { GetCompanyUseCase } from '../application/use-cases/get-company.use-case';
import { UpdateCompanyUseCase } from '../application/use-cases/update-company.use-case';
import { DeleteCompanyUseCase } from '../application/use-cases/delete-company.use-case';

describe('CompaniesService', () => {
    let service: CompaniesService;
    let createCompanyUseCase: jest.Mocked<CreateCompanyUseCase>;
    let getCompaniesUseCase: jest.Mocked<GetCompaniesUseCase>;
    let getCompanyUseCase: jest.Mocked<GetCompanyUseCase>;
    let updateCompanyUseCase: jest.Mocked<UpdateCompanyUseCase>;
    let deleteCompanyUseCase: jest.Mocked<DeleteCompanyUseCase>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CompaniesService,
                { provide: CreateCompanyUseCase, useValue: { execute: jest.fn() } },
                { provide: GetCompaniesUseCase, useValue: { execute: jest.fn() } },
                { provide: GetCompanyUseCase, useValue: { execute: jest.fn() } },
                { provide: UpdateCompanyUseCase, useValue: { execute: jest.fn() } },
                { provide: DeleteCompanyUseCase, useValue: { execute: jest.fn() } },
            ],
        }).compile();

        service = module.get<CompaniesService>(CompaniesService);
        createCompanyUseCase = module.get(CreateCompanyUseCase);
        getCompaniesUseCase = module.get(GetCompaniesUseCase);
        getCompanyUseCase = module.get(GetCompanyUseCase);
        updateCompanyUseCase = module.get(UpdateCompanyUseCase);
        deleteCompanyUseCase = module.get(DeleteCompanyUseCase);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should delegate to CreateCompanyUseCase', async () => {
            const dto = { name: 'Test Company', email: 'test@company.com' };
            const expected = { id: '1', ...dto };
            createCompanyUseCase.execute.mockResolvedValue(expected as any);

            const result = await service.create(dto);

            expect(createCompanyUseCase.execute).toHaveBeenCalledWith(dto);
            expect(result).toEqual(expected);
        });
    });

    describe('findAll', () => {
        it('should delegate to GetCompaniesUseCase', async () => {
            const expected = [{ id: '1', name: 'Company A' }];
            getCompaniesUseCase.execute.mockResolvedValue(expected as any);

            const result = await service.findAll();

            expect(getCompaniesUseCase.execute).toHaveBeenCalled();
            expect(result).toEqual(expected);
        });
    });

    describe('findOne', () => {
        it('should delegate to GetCompanyUseCase', async () => {
            const expected = { id: '1', name: 'Test Company' };
            getCompanyUseCase.execute.mockResolvedValue(expected as any);

            const result = await service.findOne('1');

            expect(getCompanyUseCase.execute).toHaveBeenCalledWith('1');
            expect(result).toEqual(expected);
        });
    });

    describe('update', () => {
        it('should delegate to UpdateCompanyUseCase', async () => {
            const dto = { name: 'Updated Company' };
            const expected = { id: '1', ...dto };
            updateCompanyUseCase.execute.mockResolvedValue(expected as any);

            const result = await service.update('1', dto);

            expect(updateCompanyUseCase.execute).toHaveBeenCalledWith('1', dto);
            expect(result).toEqual(expected);
        });
    });

    describe('remove', () => {
        it('should delegate to DeleteCompanyUseCase', async () => {
            deleteCompanyUseCase.execute.mockResolvedValue(undefined);

            await service.remove('1');

            expect(deleteCompanyUseCase.execute).toHaveBeenCalledWith('1');
        });
    });
});

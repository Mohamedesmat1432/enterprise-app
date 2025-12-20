import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesController } from './companies.controller';
import { CreateCompanyUseCase } from '../application/use-cases/create-company.use-case';
import { GetCompaniesUseCase } from '../application/use-cases/get-companies.use-case';
import { GetCompanyUseCase } from '../application/use-cases/get-company.use-case';
import { UpdateCompanyUseCase } from '../application/use-cases/update-company.use-case';
import { DeleteCompanyUseCase } from '../application/use-cases/delete-company.use-case';

describe('CompaniesController', () => {
    let controller: CompaniesController;
    let createCompanyUseCase: jest.Mocked<CreateCompanyUseCase>;
    let getCompaniesUseCase: jest.Mocked<GetCompaniesUseCase>;
    let getCompanyUseCase: jest.Mocked<GetCompanyUseCase>;
    let updateCompanyUseCase: jest.Mocked<UpdateCompanyUseCase>;
    let deleteCompanyUseCase: jest.Mocked<DeleteCompanyUseCase>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CompaniesController],
            providers: [
                { provide: CreateCompanyUseCase, useValue: { execute: jest.fn() } },
                { provide: GetCompaniesUseCase, useValue: { execute: jest.fn() } },
                { provide: GetCompanyUseCase, useValue: { execute: jest.fn() } },
                { provide: UpdateCompanyUseCase, useValue: { execute: jest.fn() } },
                { provide: DeleteCompanyUseCase, useValue: { execute: jest.fn() } },
            ],
        }).compile();

        controller = module.get<CompaniesController>(CompaniesController);
        createCompanyUseCase = module.get(CreateCompanyUseCase);
        getCompaniesUseCase = module.get(GetCompaniesUseCase);
        getCompanyUseCase = module.get(GetCompanyUseCase);
        updateCompanyUseCase = module.get(UpdateCompanyUseCase);
        deleteCompanyUseCase = module.get(DeleteCompanyUseCase);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a company', async () => {
            const dto = { name: 'Test Company', email: 'test@company.com' };
            const expected = { id: '1', ...dto };
            createCompanyUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.create(dto);

            expect(createCompanyUseCase.execute).toHaveBeenCalledWith(dto);
            expect(result).toEqual(expected);
        });
    });

    describe('findAll', () => {
        it('should return all companies', async () => {
            const expected = [{ id: '1', name: 'Company A' }, { id: '2', name: 'Company B' }];
            getCompaniesUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.findAll();

            expect(getCompaniesUseCase.execute).toHaveBeenCalled();
            expect(result).toEqual(expected);
        });
    });

    describe('findOne', () => {
        it('should return a company by id', async () => {
            const expected = { id: '1', name: 'Test Company' };
            getCompanyUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.findOne('1');

            expect(getCompanyUseCase.execute).toHaveBeenCalledWith('1');
            expect(result).toEqual(expected);
        });
    });

    describe('update', () => {
        it('should update a company', async () => {
            const dto = { name: 'Updated Company' };
            const expected = { id: '1', ...dto };
            updateCompanyUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.update('1', dto);

            expect(updateCompanyUseCase.execute).toHaveBeenCalledWith('1', dto);
            expect(result).toEqual(expected);
        });
    });

    describe('remove', () => {
        it('should delete a company', async () => {
            deleteCompanyUseCase.execute.mockResolvedValue(undefined);

            await controller.remove('1');

            expect(deleteCompanyUseCase.execute).toHaveBeenCalledWith('1');
        });
    });
});

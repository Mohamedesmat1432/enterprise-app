import { Test, TestingModule } from '@nestjs/testing';
import { PartnersService } from './partners.service';
import { CreatePartnerUseCase } from '../application/use-cases/create-partner.use-case';
import { GetPartnersUseCase } from '../application/use-cases/get-partners.use-case';
import { GetPartnerUseCase } from '../application/use-cases/get-partner.use-case';
import { UpdatePartnerUseCase } from '../application/use-cases/update-partner.use-case';
import { DeletePartnerUseCase } from '../application/use-cases/delete-partner.use-case';
import { CreatePartnerDto } from '../dto/create-partner.dto';
import { UpdatePartnerDto } from '../dto/update-partner.dto';
import { PartnerQueryDto } from '../dto/partner-query.dto';

describe('PartnersService', () => {
    let service: PartnersService;
    let createUseCase: jest.Mocked<CreatePartnerUseCase>;
    let getPartnersUseCase: jest.Mocked<GetPartnersUseCase>;
    let getPartnerUseCase: jest.Mocked<GetPartnerUseCase>;
    let updateUseCase: jest.Mocked<UpdatePartnerUseCase>;
    let deleteUseCase: jest.Mocked<DeletePartnerUseCase>;

    const mockPartner = { id: 'partner-1', name: 'Test Partner', companyId: 'company-1' };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PartnersService,
                {
                    provide: CreatePartnerUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: GetPartnersUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: GetPartnerUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: UpdatePartnerUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: DeletePartnerUseCase,
                    useValue: { execute: jest.fn() },
                },
            ],
        }).compile();

        service = module.get<PartnersService>(PartnersService);
        createUseCase = module.get(CreatePartnerUseCase);
        getPartnersUseCase = module.get(GetPartnersUseCase);
        getPartnerUseCase = module.get(GetPartnerUseCase);
        updateUseCase = module.get(UpdatePartnerUseCase);
        deleteUseCase = module.get(DeletePartnerUseCase);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should delegate to CreatePartnerUseCase', async () => {
            const dto = { name: 'New Partner' };
            createUseCase.execute.mockResolvedValue(mockPartner as any);

            const result = await service.create(dto, 'company-1', 'user-1');

            expect(createUseCase.execute).toHaveBeenCalledWith('company-1', dto, 'user-1');
            expect(result).toEqual(mockPartner);
        });
    });

    describe('findAll', () => {
        it('should delegate to GetPartnersUseCase', async () => {
            const query: PartnerQueryDto = { page: 1, limit: 10 };
            const partners = [mockPartner];
            getPartnersUseCase.execute.mockResolvedValue(partners as any);

            const result = await service.findAll(query, 'company-1');

            expect(getPartnersUseCase.execute).toHaveBeenCalledWith('company-1', query);
            expect(result).toEqual(partners);
        });
    });

    describe('findOne', () => {
        it('should delegate to GetPartnerUseCase', async () => {
            getPartnerUseCase.execute.mockResolvedValue(mockPartner as any);

            const result = await service.findOne('partner-1', 'company-1');

            expect(getPartnerUseCase.execute).toHaveBeenCalledWith('company-1', 'partner-1');
            expect(result).toEqual(mockPartner);
        });
    });

    describe('update', () => {
        it('should delegate to UpdatePartnerUseCase', async () => {
            const dto: UpdatePartnerDto = { name: 'Updated Partner' } as UpdatePartnerDto;
            updateUseCase.execute.mockResolvedValue({ ...mockPartner, ...dto } as any);

            const result = await service.update('partner-1', dto, 'company-1', 'user-1');

            expect(updateUseCase.execute).toHaveBeenCalledWith('company-1', 'partner-1', dto, 'user-1');
            expect(result.name).toBe('Updated Partner');
        });
    });

    describe('remove', () => {
        it('should delegate to DeletePartnerUseCase', async () => {
            deleteUseCase.execute.mockResolvedValue(undefined);

            await service.remove('partner-1', 'company-1');

            expect(deleteUseCase.execute).toHaveBeenCalledWith('company-1', 'partner-1');
        });
    });
});

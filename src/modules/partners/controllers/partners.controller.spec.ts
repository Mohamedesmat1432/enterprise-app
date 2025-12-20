import { Test, TestingModule } from '@nestjs/testing';
import { PartnersController } from './partners.controller';
import { PartnersService } from '../services/partners.service';

describe('PartnersController', () => {
    let controller: PartnersController;
    let partnersService: jest.Mocked<PartnersService>;

    const mockRequest = { user: { companyId: 'company-1', id: 'user-1' } };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PartnersController],
            providers: [
                {
                    provide: PartnersService,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<PartnersController>(PartnersController);
        partnersService = module.get(PartnersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a partner', async () => {
            const dto = { name: 'Partner A', email: 'partner@example.com', isCustomer: true };
            const expected = { id: '1', ...dto };
            partnersService.create.mockResolvedValue(expected as any);

            const result = await controller.create(dto as any, mockRequest);

            expect(partnersService.create).toHaveBeenCalledWith(dto, 'company-1', 'user-1');
            expect(result).toEqual(expected);
        });
    });

    describe('findAll', () => {
        it('should return paginated partners', async () => {
            const query = { page: 1, limit: 10 };
            const expected = { items: [{ id: '1', name: 'Partner A' }], total: 1 };
            partnersService.findAll.mockResolvedValue(expected as any);

            const result = await controller.findAll(query, mockRequest);

            expect(partnersService.findAll).toHaveBeenCalledWith(query, 'company-1');
            expect(result).toEqual(expected);
        });
    });

    describe('findOne', () => {
        it('should return a partner by id', async () => {
            const expected = { id: '1', name: 'Partner A' };
            partnersService.findOne.mockResolvedValue(expected as any);

            const result = await controller.findOne('1', mockRequest);

            expect(partnersService.findOne).toHaveBeenCalledWith('1', 'company-1');
            expect(result).toEqual(expected);
        });
    });

    describe('update', () => {
        it('should update a partner', async () => {
            const dto = { name: 'Updated Partner' };
            const expected = { id: '1', ...dto };
            partnersService.update.mockResolvedValue(expected as any);

            const result = await controller.update('1', dto as any, mockRequest);

            expect(partnersService.update).toHaveBeenCalledWith('1', dto, 'company-1', 'user-1');
            expect(result).toEqual(expected);
        });
    });

    describe('remove', () => {
        it('should delete a partner', async () => {
            partnersService.remove.mockResolvedValue({ message: 'Partner deleted' } as any);

            await controller.remove('1', mockRequest);

            expect(partnersService.remove).toHaveBeenCalledWith('1', 'company-1');
        });
    });
});

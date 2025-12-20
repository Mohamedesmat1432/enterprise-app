import { Test, TestingModule } from '@nestjs/testing';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseOrderUseCase } from '../application/use-cases/create-purchase-order.use-case';
import { GetPurchaseOrdersUseCase } from '../application/use-cases/get-purchase-orders.use-case';
import { GetPurchaseOrderUseCase } from '../application/use-cases/get-purchase-order.use-case';
import { ConfirmPurchaseOrderUseCase } from '../application/use-cases/confirm-purchase-order.use-case';
import { CreateBillFromOrderUseCase } from '../application/use-cases/create-bill-from-order.use-case';
import { CreatePurchaseOrderDto } from '../dto/create-purchase-order.dto';

describe('PurchasesService', () => {
    let service: PurchasesService;
    let createUseCase: jest.Mocked<CreatePurchaseOrderUseCase>;
    let getOrdersUseCase: jest.Mocked<GetPurchaseOrdersUseCase>;
    let getOrderUseCase: jest.Mocked<GetPurchaseOrderUseCase>;
    let confirmUseCase: jest.Mocked<ConfirmPurchaseOrderUseCase>;
    let createBillUseCase: jest.Mocked<CreateBillFromOrderUseCase>;

    const mockOrder = { id: 'po-1', companyId: 'company-1', state: 'draft' };
    const mockBill = { id: 'bill-1', orderId: 'po-1' };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PurchasesService,
                {
                    provide: CreatePurchaseOrderUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: GetPurchaseOrdersUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: GetPurchaseOrderUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: ConfirmPurchaseOrderUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: CreateBillFromOrderUseCase,
                    useValue: { execute: jest.fn() },
                },
            ],
        }).compile();

        service = module.get<PurchasesService>(PurchasesService);
        createUseCase = module.get(CreatePurchaseOrderUseCase);
        getOrdersUseCase = module.get(GetPurchaseOrdersUseCase);
        getOrderUseCase = module.get(GetPurchaseOrderUseCase);
        confirmUseCase = module.get(ConfirmPurchaseOrderUseCase);
        createBillUseCase = module.get(CreateBillFromOrderUseCase);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should delegate to CreatePurchaseOrderUseCase', async () => {
            const dto: CreatePurchaseOrderDto = { vendorId: 'vendor-1', orderDate: '2024-01-01', lines: [] };
            createUseCase.execute.mockResolvedValue(mockOrder as any);

            const result = await service.create(dto, 'company-1', 'user-1');

            expect(createUseCase.execute).toHaveBeenCalledWith('company-1', dto, 'user-1');
            expect(result).toEqual(mockOrder);
        });
    });

    describe('confirmOrder', () => {
        it('should delegate to ConfirmPurchaseOrderUseCase', async () => {
            confirmUseCase.execute.mockResolvedValue({ ...mockOrder, state: 'confirmed' } as any);

            const result = await service.confirmOrder('company-1', 'po-1', 'user-1');

            expect(confirmUseCase.execute).toHaveBeenCalledWith('company-1', 'po-1', 'user-1');
            expect(result.state).toBe('confirmed');
        });
    });

    describe('createBillFromOrder', () => {
        it('should delegate to CreateBillFromOrderUseCase', async () => {
            createBillUseCase.execute.mockResolvedValue(mockBill as any);

            const result = await service.createBillFromOrder('company-1', 'po-1', 'user-1');

            expect(createBillUseCase.execute).toHaveBeenCalledWith('company-1', 'po-1');
            expect(result).toEqual(mockBill);
        });
    });

    describe('findAll', () => {
        it('should delegate to GetPurchaseOrdersUseCase', async () => {
            const orders = [mockOrder];
            getOrdersUseCase.execute.mockResolvedValue(orders as any);

            const result = await service.findAll('company-1');

            expect(getOrdersUseCase.execute).toHaveBeenCalledWith('company-1');
            expect(result).toEqual(orders);
        });
    });

    describe('findOne', () => {
        it('should delegate to GetPurchaseOrderUseCase', async () => {
            getOrderUseCase.execute.mockResolvedValue(mockOrder as any);

            const result = await service.findOne('po-1', 'company-1');

            expect(getOrderUseCase.execute).toHaveBeenCalledWith('po-1', 'company-1');
            expect(result).toEqual(mockOrder);
        });
    });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PurchasesController } from './purchases.controller';
import { CreatePurchaseOrderUseCase } from '../application/use-cases/create-purchase-order.use-case';
import { GetPurchaseOrdersUseCase } from '../application/use-cases/get-purchase-orders.use-case';
import { GetPurchaseOrderUseCase } from '../application/use-cases/get-purchase-order.use-case';
import { ConfirmPurchaseOrderUseCase } from '../application/use-cases/confirm-purchase-order.use-case';
import { CreateBillFromOrderUseCase } from '../application/use-cases/create-bill-from-order.use-case';

describe('PurchasesController', () => {
    let controller: PurchasesController;
    let createUseCase: jest.Mocked<CreatePurchaseOrderUseCase>;
    let getOrdersUseCase: jest.Mocked<GetPurchaseOrdersUseCase>;
    let getOrderUseCase: jest.Mocked<GetPurchaseOrderUseCase>;
    let confirmUseCase: jest.Mocked<ConfirmPurchaseOrderUseCase>;
    let createBillUseCase: jest.Mocked<CreateBillFromOrderUseCase>;

    const mockRequest = { user: { companyId: 'company-1', id: 'user-1' } };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PurchasesController],
            providers: [
                { provide: CreatePurchaseOrderUseCase, useValue: { execute: jest.fn() } },
                { provide: GetPurchaseOrdersUseCase, useValue: { execute: jest.fn() } },
                { provide: GetPurchaseOrderUseCase, useValue: { execute: jest.fn() } },
                { provide: ConfirmPurchaseOrderUseCase, useValue: { execute: jest.fn() } },
                { provide: CreateBillFromOrderUseCase, useValue: { execute: jest.fn() } },
            ],
        }).compile();

        controller = module.get<PurchasesController>(PurchasesController);
        createUseCase = module.get(CreatePurchaseOrderUseCase);
        getOrdersUseCase = module.get(GetPurchaseOrdersUseCase);
        getOrderUseCase = module.get(GetPurchaseOrderUseCase);
        confirmUseCase = module.get(ConfirmPurchaseOrderUseCase);
        createBillUseCase = module.get(CreateBillFromOrderUseCase);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a purchase order', async () => {
            const dto = { vendorId: 'vendor-1', orderDate: '2024-01-01', lines: [] };
            const expected = { id: '1', ...dto, state: 'draft' };
            createUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.create(dto, mockRequest);

            expect(createUseCase.execute).toHaveBeenCalledWith('company-1', dto, 'user-1');
            expect(result).toEqual(expected);
        });
    });

    describe('findAll', () => {
        it('should return all purchase orders', async () => {
            const expected = [{ id: '1', state: 'draft' }];
            getOrdersUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.findAll(mockRequest);

            expect(getOrdersUseCase.execute).toHaveBeenCalledWith('company-1');
            expect(result).toEqual(expected);
        });
    });

    describe('findOne', () => {
        it('should return a purchase order by id', async () => {
            const expected = { id: '1', state: 'draft', lines: [] };
            getOrderUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.findOne('1', mockRequest);

            expect(getOrderUseCase.execute).toHaveBeenCalledWith('1', 'company-1');
            expect(result).toEqual(expected);
        });
    });

    describe('confirm', () => {
        it('should confirm a purchase order', async () => {
            const expected = { id: '1', state: 'confirmed' };
            confirmUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.confirm('1', mockRequest);

            expect(confirmUseCase.execute).toHaveBeenCalledWith('company-1', '1', 'user-1');
            expect(result).toEqual(expected);
        });
    });

    describe('createBill', () => {
        it('should create bill from purchase order', async () => {
            const expected = { id: 'invoice-1', type: 'vendor_bill' };
            createBillUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.createBill('1', mockRequest);

            expect(createBillUseCase.execute).toHaveBeenCalledWith('company-1', '1');
            expect(result).toEqual(expected);
        });
    });
});

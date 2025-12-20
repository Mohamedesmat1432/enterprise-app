import { Test, TestingModule } from '@nestjs/testing';
import { SalesController } from './sales.controller';
import { CreateSalesOrderUseCase } from '../application/use-cases/create-sales-order.use-case';
import { GetSalesOrdersUseCase } from '../application/use-cases/get-sales-orders.use-case';
import { GetSalesOrderUseCase } from '../application/use-cases/get-sales-order.use-case';
import { ConfirmSalesOrderUseCase } from '../application/use-cases/confirm-sales-order.use-case';
import { CreateInvoiceFromOrderUseCase } from '../application/use-cases/create-invoice-from-order.use-case';

describe('SalesController', () => {
    let controller: SalesController;
    let createUseCase: jest.Mocked<CreateSalesOrderUseCase>;
    let getOrdersUseCase: jest.Mocked<GetSalesOrdersUseCase>;
    let getOrderUseCase: jest.Mocked<GetSalesOrderUseCase>;
    let confirmUseCase: jest.Mocked<ConfirmSalesOrderUseCase>;
    let createInvoiceUseCase: jest.Mocked<CreateInvoiceFromOrderUseCase>;

    const mockRequest = { user: { companyId: 'company-1', id: 'user-1' } };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SalesController],
            providers: [
                { provide: CreateSalesOrderUseCase, useValue: { execute: jest.fn() } },
                { provide: GetSalesOrdersUseCase, useValue: { execute: jest.fn() } },
                { provide: GetSalesOrderUseCase, useValue: { execute: jest.fn() } },
                { provide: ConfirmSalesOrderUseCase, useValue: { execute: jest.fn() } },
                { provide: CreateInvoiceFromOrderUseCase, useValue: { execute: jest.fn() } },
            ],
        }).compile();

        controller = module.get<SalesController>(SalesController);
        createUseCase = module.get(CreateSalesOrderUseCase);
        getOrdersUseCase = module.get(GetSalesOrdersUseCase);
        getOrderUseCase = module.get(GetSalesOrderUseCase);
        confirmUseCase = module.get(ConfirmSalesOrderUseCase);
        createInvoiceUseCase = module.get(CreateInvoiceFromOrderUseCase);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a sales order', async () => {
            const dto = { customerId: 'partner-1', orderDate: '2024-01-01', lines: [] };
            const expected = { id: '1', ...dto, state: 'draft' };
            createUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.create(dto, mockRequest);

            expect(createUseCase.execute).toHaveBeenCalledWith('company-1', dto, 'user-1');
            expect(result).toEqual(expected);
        });
    });

    describe('findAll', () => {
        it('should return all sales orders', async () => {
            const expected = [{ id: '1', state: 'draft' }];
            getOrdersUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.findAll(mockRequest);

            expect(getOrdersUseCase.execute).toHaveBeenCalledWith('company-1');
            expect(result).toEqual(expected);
        });
    });

    describe('findOne', () => {
        it('should return a sales order by id', async () => {
            const expected = { id: '1', state: 'draft', lines: [] };
            getOrderUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.findOne('1', mockRequest);

            expect(getOrderUseCase.execute).toHaveBeenCalledWith('1', 'company-1');
            expect(result).toEqual(expected);
        });
    });

    describe('confirm', () => {
        it('should confirm a sales order', async () => {
            const expected = { id: '1', state: 'confirmed' };
            confirmUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.confirm('1', mockRequest);

            expect(confirmUseCase.execute).toHaveBeenCalledWith('company-1', '1', 'user-1');
            expect(result).toEqual(expected);
        });
    });

    describe('createInvoice', () => {
        it('should create invoice from sales order', async () => {
            const expected = { id: 'invoice-1', type: 'customer_invoice' };
            createInvoiceUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.createInvoice('1', mockRequest);

            expect(createInvoiceUseCase.execute).toHaveBeenCalledWith('company-1', '1');
            expect(result).toEqual(expected);
        });
    });
});

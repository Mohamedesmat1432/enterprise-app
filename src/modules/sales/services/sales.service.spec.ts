import { Test, TestingModule } from '@nestjs/testing';
import { SalesService } from './sales.service';
import { CreateSalesOrderUseCase } from '../application/use-cases/create-sales-order.use-case';
import { GetSalesOrdersUseCase } from '../application/use-cases/get-sales-orders.use-case';
import { GetSalesOrderUseCase } from '../application/use-cases/get-sales-order.use-case';
import { ConfirmSalesOrderUseCase } from '../application/use-cases/confirm-sales-order.use-case';
import { CreateInvoiceFromOrderUseCase } from '../application/use-cases/create-invoice-from-order.use-case';
import { CreateSalesOrderDto } from '../dto/create-sales-order.dto';

describe('SalesService', () => {
    let service: SalesService;
    let createUseCase: jest.Mocked<CreateSalesOrderUseCase>;
    let getOrdersUseCase: jest.Mocked<GetSalesOrdersUseCase>;
    let getOrderUseCase: jest.Mocked<GetSalesOrderUseCase>;
    let confirmUseCase: jest.Mocked<ConfirmSalesOrderUseCase>;
    let createInvoiceUseCase: jest.Mocked<CreateInvoiceFromOrderUseCase>;

    const mockOrder = { id: 'order-1', companyId: 'company-1', state: 'draft' };
    const mockInvoice = { id: 'inv-1', orderId: 'order-1' };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SalesService,
                {
                    provide: CreateSalesOrderUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: GetSalesOrdersUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: GetSalesOrderUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: ConfirmSalesOrderUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: CreateInvoiceFromOrderUseCase,
                    useValue: { execute: jest.fn() },
                },
            ],
        }).compile();

        service = module.get<SalesService>(SalesService);
        createUseCase = module.get(CreateSalesOrderUseCase);
        getOrdersUseCase = module.get(GetSalesOrdersUseCase);
        getOrderUseCase = module.get(GetSalesOrderUseCase);
        confirmUseCase = module.get(ConfirmSalesOrderUseCase);
        createInvoiceUseCase = module.get(CreateInvoiceFromOrderUseCase);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should delegate to CreateSalesOrderUseCase', async () => {
            const dto: CreateSalesOrderDto = { customerId: 'customer-1', orderDate: '2024-01-01', lines: [] };
            createUseCase.execute.mockResolvedValue(mockOrder as any);

            const result = await service.create(dto, 'company-1', 'user-1');

            expect(createUseCase.execute).toHaveBeenCalledWith('company-1', dto, 'user-1');
            expect(result).toEqual(mockOrder);
        });
    });

    describe('confirmOrder', () => {
        it('should delegate to ConfirmSalesOrderUseCase', async () => {
            confirmUseCase.execute.mockResolvedValue({ ...mockOrder, state: 'confirmed' } as any);

            const result = await service.confirmOrder('company-1', 'order-1', 'user-1');

            expect(confirmUseCase.execute).toHaveBeenCalledWith('company-1', 'order-1', 'user-1');
            expect(result.state).toBe('confirmed');
        });
    });

    describe('createInvoiceFromOrder', () => {
        it('should delegate to CreateInvoiceFromOrderUseCase', async () => {
            createInvoiceUseCase.execute.mockResolvedValue(mockInvoice as any);

            const result = await service.createInvoiceFromOrder('company-1', 'order-1', 'user-1');

            expect(createInvoiceUseCase.execute).toHaveBeenCalledWith('company-1', 'order-1');
            expect(result).toEqual(mockInvoice);
        });
    });

    describe('findAll', () => {
        it('should delegate to GetSalesOrdersUseCase', async () => {
            const orders = [mockOrder];
            getOrdersUseCase.execute.mockResolvedValue(orders as any);

            const result = await service.findAll('company-1');

            expect(getOrdersUseCase.execute).toHaveBeenCalledWith('company-1');
            expect(result).toEqual(orders);
        });
    });

    describe('findOne', () => {
        it('should delegate to GetSalesOrderUseCase', async () => {
            getOrderUseCase.execute.mockResolvedValue(mockOrder as any);

            const result = await service.findOne('order-1', 'company-1');

            expect(getOrderUseCase.execute).toHaveBeenCalledWith('order-1', 'company-1');
            expect(result).toEqual(mockOrder);
        });
    });
});

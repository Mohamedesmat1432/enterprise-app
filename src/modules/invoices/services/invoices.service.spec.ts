import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceUseCase } from '../application/use-cases/create-invoice.use-case';
import { GetInvoicesUseCase } from '../application/use-cases/get-invoices.use-case';
import { GetInvoiceUseCase } from '../application/use-cases/get-invoice.use-case';
import { PostInvoiceUseCase } from '../application/use-cases/post-invoice.use-case';
import { CreatePaymentUseCase } from '../application/use-cases/create-payment.use-case';
import { GetPaymentsUseCase } from '../application/use-cases/get-payments.use-case';
import { CreateInvoiceDto, CreatePaymentDto } from '../dto/invoices.dto';

describe('InvoicesService', () => {
    let service: InvoicesService;
    let createInvoiceUseCase: jest.Mocked<CreateInvoiceUseCase>;
    let getInvoicesUseCase: jest.Mocked<GetInvoicesUseCase>;
    let getInvoiceUseCase: jest.Mocked<GetInvoiceUseCase>;
    let postInvoiceUseCase: jest.Mocked<PostInvoiceUseCase>;
    let createPaymentUseCase: jest.Mocked<CreatePaymentUseCase>;
    let getPaymentsUseCase: jest.Mocked<GetPaymentsUseCase>;

    const mockInvoice = { id: 'inv-1', companyId: 'company-1', type: 'customer_invoice' };
    const mockPayment = { id: 'pay-1', invoiceId: 'inv-1', amount: 100 };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InvoicesService,
                {
                    provide: CreateInvoiceUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: GetInvoicesUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: GetInvoiceUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: PostInvoiceUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: CreatePaymentUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: GetPaymentsUseCase,
                    useValue: { execute: jest.fn() },
                },
            ],
        }).compile();

        service = module.get<InvoicesService>(InvoicesService);
        createInvoiceUseCase = module.get(CreateInvoiceUseCase);
        getInvoicesUseCase = module.get(GetInvoicesUseCase);
        getInvoiceUseCase = module.get(GetInvoiceUseCase);
        postInvoiceUseCase = module.get(PostInvoiceUseCase);
        createPaymentUseCase = module.get(CreatePaymentUseCase);
        getPaymentsUseCase = module.get(GetPaymentsUseCase);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createInvoice', () => {
        it('should delegate to CreateInvoiceUseCase', async () => {
            const dto: CreateInvoiceDto = { partnerId: 'partner-1', date: '2024-01-01', dueDate: '2024-01-31', type: 'customer_invoice', lines: [] };
            createInvoiceUseCase.execute.mockResolvedValue(mockInvoice as any);

            const result = await service.createInvoice('company-1', dto);

            expect(createInvoiceUseCase.execute).toHaveBeenCalledWith('company-1', dto);
            expect(result).toEqual(mockInvoice);
        });
    });

    describe('postInvoice', () => {
        it('should delegate to PostInvoiceUseCase', async () => {
            postInvoiceUseCase.execute.mockResolvedValue({ ...mockInvoice, state: 'posted' } as any);

            const result = await service.postInvoice('company-1', 'inv-1');

            expect(postInvoiceUseCase.execute).toHaveBeenCalledWith('company-1', 'inv-1');
            expect(result.state).toBe('posted');
        });
    });

    describe('findOne', () => {
        it('should delegate to GetInvoiceUseCase', async () => {
            getInvoiceUseCase.execute.mockResolvedValue(mockInvoice as any);

            const result = await service.findOne('inv-1', 'company-1');

            expect(getInvoiceUseCase.execute).toHaveBeenCalledWith('company-1', 'inv-1');
            expect(result).toEqual(mockInvoice);
        });
    });

    describe('findAllInvoices', () => {
        it('should delegate to GetInvoicesUseCase with type', async () => {
            const invoices = [mockInvoice];
            getInvoicesUseCase.execute.mockResolvedValue(invoices as any);

            const result = await service.findAllInvoices('company-1', 'customer_invoice');

            expect(getInvoicesUseCase.execute).toHaveBeenCalledWith('company-1', 'customer_invoice');
            expect(result).toEqual(invoices);
        });

        it('should delegate to GetInvoicesUseCase without type', async () => {
            const invoices = [mockInvoice];
            getInvoicesUseCase.execute.mockResolvedValue(invoices as any);

            const result = await service.findAllInvoices('company-1');

            expect(getInvoicesUseCase.execute).toHaveBeenCalledWith('company-1', undefined);
            expect(result).toEqual(invoices);
        });
    });

    describe('createPayment', () => {
        it('should delegate to CreatePaymentUseCase', async () => {
            const dto: CreatePaymentDto = { partnerId: 'partner-1', invoiceId: 'inv-1', date: '2024-01-15', amount: 100, type: 'inbound' };
            createPaymentUseCase.execute.mockResolvedValue(mockPayment as any);

            const result = await service.createPayment('company-1', dto);

            expect(createPaymentUseCase.execute).toHaveBeenCalledWith('company-1', dto);
            expect(result).toEqual(mockPayment);
        });
    });

    describe('findAllPayments', () => {
        it('should delegate to GetPaymentsUseCase', async () => {
            const payments = [mockPayment];
            getPaymentsUseCase.execute.mockResolvedValue(payments as any);

            const result = await service.findAllPayments('company-1');

            expect(getPaymentsUseCase.execute).toHaveBeenCalledWith('company-1');
            expect(result).toEqual(payments);
        });
    });
});

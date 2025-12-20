import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from './invoices.controller';
import { CreateInvoiceUseCase } from '../application/use-cases/create-invoice.use-case';
import { GetInvoicesUseCase } from '../application/use-cases/get-invoices.use-case';
import { PostInvoiceUseCase } from '../application/use-cases/post-invoice.use-case';
import { CreatePaymentUseCase } from '../application/use-cases/create-payment.use-case';
import { GetPaymentsUseCase } from '../application/use-cases/get-payments.use-case';

describe('InvoicesController', () => {
    let controller: InvoicesController;
    let createInvoiceUseCase: jest.Mocked<CreateInvoiceUseCase>;
    let getInvoicesUseCase: jest.Mocked<GetInvoicesUseCase>;
    let postInvoiceUseCase: jest.Mocked<PostInvoiceUseCase>;
    let createPaymentUseCase: jest.Mocked<CreatePaymentUseCase>;
    let getPaymentsUseCase: jest.Mocked<GetPaymentsUseCase>;

    const mockRequest = { user: { companyId: 'company-1', id: 'user-1' } };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [InvoicesController],
            providers: [
                { provide: CreateInvoiceUseCase, useValue: { execute: jest.fn() } },
                { provide: GetInvoicesUseCase, useValue: { execute: jest.fn() } },
                { provide: PostInvoiceUseCase, useValue: { execute: jest.fn() } },
                { provide: CreatePaymentUseCase, useValue: { execute: jest.fn() } },
                { provide: GetPaymentsUseCase, useValue: { execute: jest.fn() } },
            ],
        }).compile();

        controller = module.get<InvoicesController>(InvoicesController);
        createInvoiceUseCase = module.get(CreateInvoiceUseCase);
        getInvoicesUseCase = module.get(GetInvoicesUseCase);
        postInvoiceUseCase = module.get(PostInvoiceUseCase);
        createPaymentUseCase = module.get(CreatePaymentUseCase);
        getPaymentsUseCase = module.get(GetPaymentsUseCase);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('createInvoice', () => {
        it('should create an invoice', async () => {
            const dto = { partnerId: 'partner-1', date: '2024-01-01', lines: [] };
            const expected = { id: '1', ...dto };
            createInvoiceUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.createInvoice(mockRequest, dto as any);

            expect(createInvoiceUseCase.execute).toHaveBeenCalledWith('company-1', dto);
            expect(result).toEqual(expected);
        });
    });

    describe('findAllInvoices', () => {
        it('should return all invoices', async () => {
            const expected = [{ id: '1', totalAmount: 1000 }];
            getInvoicesUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.findAllInvoices(mockRequest);

            expect(getInvoicesUseCase.execute).toHaveBeenCalledWith('company-1', undefined);
            expect(result).toEqual(expected);
        });

        it('should filter invoices by type', async () => {
            const expected = [{ id: '1', type: 'customer_invoice' }];
            getInvoicesUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.findAllInvoices(mockRequest, 'customer_invoice');

            expect(getInvoicesUseCase.execute).toHaveBeenCalledWith('company-1', 'customer_invoice');
            expect(result).toEqual(expected);
        });
    });

    describe('postInvoice', () => {
        it('should post an invoice', async () => {
            const expected = { id: '1', state: 'posted' };
            postInvoiceUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.postInvoice(mockRequest, '1');

            expect(postInvoiceUseCase.execute).toHaveBeenCalledWith('company-1', '1');
            expect(result).toEqual(expected);
        });
    });

    describe('createPayment', () => {
        it('should create a payment', async () => {
            const dto = { amount: 500, invoiceId: 'inv-1' };
            const expected = { id: 'payment-1', amount: 500 };
            createPaymentUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.createPayment(mockRequest, dto as any);

            expect(createPaymentUseCase.execute).toHaveBeenCalledWith('company-1', dto);
            expect(result).toEqual(expected);
        });
    });

    describe('findAllPayments', () => {
        it('should return all payments', async () => {
            const expected = [{ id: 'payment-1', amount: 500 }];
            getPaymentsUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.findAllPayments(mockRequest);

            expect(getPaymentsUseCase.execute).toHaveBeenCalledWith('company-1');
            expect(result).toEqual(expected);
        });
    });
});

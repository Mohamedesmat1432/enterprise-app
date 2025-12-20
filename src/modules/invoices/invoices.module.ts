
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './domain/entities/invoice.entity';
import { InvoiceLine } from './domain/entities/invoice-line.entity';
import { Payment } from './domain/entities/payment.entity';
import { InvoicesService } from './services/invoices.service';
import { InvoicesController } from './controllers/invoices.controller';
import { AccountingModule } from '@modules/accounting/accounting.module';
import { TypeOrmInvoiceRepository } from './infrastructure/persistence/typeorm-invoice.repository';
import { TypeOrmPaymentRepository } from './infrastructure/persistence/typeorm-payment.repository';
import { TypeOrmInvoiceLineRepository } from './infrastructure/persistence/typeorm-invoice-line.repository';
import { CreateInvoiceUseCase } from './application/use-cases/create-invoice.use-case';
import { GetInvoicesUseCase } from './application/use-cases/get-invoices.use-case';
import { GetInvoiceUseCase } from './application/use-cases/get-invoice.use-case';
import { PostInvoiceUseCase } from './application/use-cases/post-invoice.use-case';
import { CreatePaymentUseCase } from './application/use-cases/create-payment.use-case';
import { GetPaymentsUseCase } from './application/use-cases/get-payments.use-case';

@Module({
    imports: [
        TypeOrmModule.forFeature([Invoice, InvoiceLine, Payment]),
        AccountingModule,
    ],
    providers: [
        InvoicesService,
        { provide: 'IInvoiceRepository', useClass: TypeOrmInvoiceRepository },
        { provide: 'IPaymentRepository', useClass: TypeOrmPaymentRepository },
        { provide: 'IInvoiceLineRepository', useClass: TypeOrmInvoiceLineRepository },
        CreateInvoiceUseCase,
        GetInvoicesUseCase,
        GetInvoiceUseCase,
        PostInvoiceUseCase,
        CreatePaymentUseCase,
        GetPaymentsUseCase,
    ],
    controllers: [InvoicesController],
    exports: [
        InvoicesService,
        'IInvoiceRepository',
        'IPaymentRepository',
    ],
})
export class InvoicesModule { }

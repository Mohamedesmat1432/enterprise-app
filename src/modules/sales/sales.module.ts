import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesOrder } from './domain/entities/sales-order.entity';
import { SalesOrderLine } from './domain/entities/sales-order-line.entity';
import { SalesService } from './services/sales.service';
import { SalesController } from './controllers/sales.controller';
import { InvoicesModule } from '@modules/invoices/invoices.module';
import { InventoryModule } from '@modules/inventory/inventory.module';

import { TypeOrmSalesOrderRepository } from './infrastructure/persistence/typeorm-sales-order.repository';
import { TypeOrmSalesOrderLineRepository } from './infrastructure/persistence/typeorm-sales-order-line.repository';
import { CreateSalesOrderUseCase } from './application/use-cases/create-sales-order.use-case';
import { GetSalesOrdersUseCase } from './application/use-cases/get-sales-orders.use-case';
import { GetSalesOrderUseCase } from './application/use-cases/get-sales-order.use-case';
import { ConfirmSalesOrderUseCase } from './application/use-cases/confirm-sales-order.use-case';
import { CreateInvoiceFromOrderUseCase } from './application/use-cases/create-invoice-from-order.use-case';

@Module({
    imports: [
        TypeOrmModule.forFeature([SalesOrder, SalesOrderLine]),
        InvoicesModule,
        InventoryModule,
    ],
    controllers: [SalesController],
    providers: [
        SalesService,
        { provide: 'ISalesOrderRepository', useClass: TypeOrmSalesOrderRepository },
        { provide: 'ISalesOrderLineRepository', useClass: TypeOrmSalesOrderLineRepository },
        CreateSalesOrderUseCase,
        GetSalesOrdersUseCase,
        GetSalesOrderUseCase,
        ConfirmSalesOrderUseCase,
        CreateInvoiceFromOrderUseCase,
    ],
    exports: [
        SalesService,
        'ISalesOrderRepository',
    ],
})
export class SalesModule { }

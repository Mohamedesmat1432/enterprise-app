import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrder } from './domain/entities/purchase-order.entity';
import { PurchaseOrderLine } from './domain/entities/purchase-order-line.entity';
import { PurchasesService } from './services/purchases.service';
import { PurchasesController } from './controllers/purchases.controller';
import { InvoicesModule } from '@modules/invoices/invoices.module';
import { InventoryModule } from '@modules/inventory/inventory.module';

import { TypeOrmPurchaseOrderRepository } from './infrastructure/persistence/typeorm-purchase-order.repository';
import { TypeOrmPurchaseOrderLineRepository } from './infrastructure/persistence/typeorm-purchase-order-line.repository';
import { CreatePurchaseOrderUseCase } from './application/use-cases/create-purchase-order.use-case';
import { GetPurchaseOrdersUseCase } from './application/use-cases/get-purchase-orders.use-case';
import { GetPurchaseOrderUseCase } from './application/use-cases/get-purchase-order.use-case';
import { ConfirmPurchaseOrderUseCase } from './application/use-cases/confirm-purchase-order.use-case';
import { CreateBillFromOrderUseCase } from './application/use-cases/create-bill-from-order.use-case';

@Module({
    imports: [
        TypeOrmModule.forFeature([PurchaseOrder, PurchaseOrderLine]),
        InvoicesModule,
        InventoryModule,
    ],
    controllers: [PurchasesController],
    providers: [
        PurchasesService,
        { provide: 'IPurchaseOrderRepository', useClass: TypeOrmPurchaseOrderRepository },
        { provide: 'IPurchaseOrderLineRepository', useClass: TypeOrmPurchaseOrderLineRepository },
        CreatePurchaseOrderUseCase,
        GetPurchaseOrdersUseCase,
        GetPurchaseOrderUseCase,
        ConfirmPurchaseOrderUseCase,
        CreateBillFromOrderUseCase,
    ],
    exports: [
        PurchasesService,
        'IPurchaseOrderRepository',
    ],
})
export class PurchasesModule { }

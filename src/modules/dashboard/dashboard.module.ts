import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesOrder } from '@modules/sales/domain/entities/sales-order.entity';
import { Invoice } from '@modules/invoices/domain/entities/invoice.entity';
import { Payment } from '@modules/invoices/domain/entities/payment.entity';
import { StockQuant } from '@modules/inventory/domain/entities/stock-quant.entity';
import { DashboardController } from './controllers/dashboard.controller';
import { DashboardService } from './services/dashboard.service';
import { AccountingModule } from '@modules/accounting/accounting.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([SalesOrder, Invoice, Payment, StockQuant]),
        AccountingModule,
    ],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule { }

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesOrder } from '@modules/sales/domain/entities/sales-order.entity';
import { Invoice } from '@modules/invoices/domain/entities/invoice.entity';
import { Payment } from '@modules/invoices/domain/entities/payment.entity';
import { StockQuant } from '@modules/inventory/domain/entities/stock-quant.entity';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(SalesOrder) private readonly salesRepo: Repository<SalesOrder>,
        @InjectRepository(Invoice) private readonly invoiceRepo: Repository<Invoice>,
        @InjectRepository(Payment) private readonly paymentRepo: Repository<Payment>,
        @InjectRepository(StockQuant) private readonly quantRepo: Repository<StockQuant>,
    ) { }

    async getStats(companyId: string) {
        const totalSales = await this.salesRepo.createQueryBuilder('so')
            .where('so.company_id = :companyId AND so.state != :state', { companyId, state: 'draft' })
            .select('SUM(so.totalAmount)', 'total')
            .getRawOne();

        const pendingInvoices = await this.invoiceRepo.createQueryBuilder('inv')
            .where('inv.company_id = :companyId AND inv.state = :state', { companyId, state: 'posted' })
            .select('SUM(inv.amountResidual)', 'total')
            .getRawOne();

        const inventoryValue = await this.quantRepo.createQueryBuilder('q')
            .innerJoin('q.product', 'p')
            .innerJoin('q.location', 'l')
            .where('l.company_id = :companyId', { companyId })
            .select('SUM(q.quantity * p.cost_price)', 'total')
            .getRawOne();

        const bankBalance = await this.paymentRepo.createQueryBuilder('p')
            .where('p.company_id = :companyId', { companyId })
            .select('SUM(p.amount)', 'total')
            .getRawOne();

        return {
            totalSales: Number(totalSales?.total || 0),
            pendingInvoices: Number(pendingInvoices?.total || 0),
            inventoryValue: Number(inventoryValue?.total || 0),
            bankBalance: Number(bankBalance?.total || 0),
        };
    }
}

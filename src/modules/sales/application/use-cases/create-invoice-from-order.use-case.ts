import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import type { ISalesOrderRepository } from '../../domain/repositories/sales-order.repository.interface';
import { InvoicesService } from '@modules/invoices/services/invoices.service';

@Injectable()
export class CreateInvoiceFromOrderUseCase {
    constructor(
        @Inject('ISalesOrderRepository')
        private readonly salesOrderRepository: ISalesOrderRepository,
        private readonly invoicesService: InvoicesService,
    ) { }

    async execute(companyId: string, orderId: string) {
        const order = await this.salesOrderRepository.findOneByCompanyWithRelations(orderId, companyId);
        if (!order) {
            throw new NotFoundException(`Sales Order with ID "${orderId}" not found`);
        }
        if (order.state !== 'confirmed' && order.state !== 'delivered') {
            throw new BadRequestException('Order must be confirmed or delivered to create an invoice');
        }

        const invoice = await this.invoicesService.createInvoice(companyId, {
            partnerId: order.customerId,
            date: new Date().toISOString(),
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            type: 'customer_invoice',
            lines: order.lines.map(line => ({
                productId: line.productId,
                name: line.product?.name || `Product ${line.productId}`,
                quantity: line.quantity,
                unitPrice: Number(line.unitPrice),
            })),
        });

        return invoice;
    }
}

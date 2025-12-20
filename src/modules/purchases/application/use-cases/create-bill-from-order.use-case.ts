import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import type { IPurchaseOrderRepository } from '../../domain/repositories/purchase-order.repository.interface';
import { InvoicesService } from '@modules/invoices/services/invoices.service';

@Injectable()
export class CreateBillFromOrderUseCase {
    constructor(
        @Inject('IPurchaseOrderRepository')
        private readonly purchaseOrderRepository: IPurchaseOrderRepository,
        private readonly invoicesService: InvoicesService,
    ) { }

    async execute(companyId: string, orderId: string) {
        const order = await this.purchaseOrderRepository.findOneByCompanyWithRelations(orderId, companyId);
        if (!order) {
            throw new NotFoundException(`Purchase Order with ID "${orderId}" not found`);
        }
        if (order.state !== 'confirmed' && order.state !== 'received') {
            throw new BadRequestException('Order must be confirmed or received to create a bill');
        }

        const bill = await this.invoicesService.createInvoice(companyId, {
            partnerId: order.vendorId,
            date: new Date().toISOString(),
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            type: 'vendor_bill',
            lines: order.lines.map(line => ({
                productId: line.productId,
                name: line.product?.name || `Product ${line.productId}`,
                quantity: line.quantity,
                unitPrice: Number(line.unitPrice),
            })),
        });

        return bill;
    }
}

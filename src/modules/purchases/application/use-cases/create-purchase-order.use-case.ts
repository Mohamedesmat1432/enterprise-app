import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import type { IPurchaseOrderRepository } from '../../domain/repositories/purchase-order.repository.interface';
import { PurchaseOrder } from '../../domain/entities/purchase-order.entity';
import { PurchaseOrderLine } from '../../domain/entities/purchase-order-line.entity';
import { CreatePurchaseOrderDto } from '../../dto/create-purchase-order.dto';

@Injectable()
export class CreatePurchaseOrderUseCase {
    constructor(
        @Inject('IPurchaseOrderRepository')
        private readonly purchaseOrderRepository: IPurchaseOrderRepository,
        private readonly dataSource: DataSource,
    ) { }

    async execute(companyId: string, dto: CreatePurchaseOrderDto, userId: string): Promise<PurchaseOrder> {
        const { lines, ...orderData } = dto;

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const order = queryRunner.manager.create(PurchaseOrder, {
                ...orderData,
                companyId,
                createdBy: userId,
                state: 'draft',
            });

            const savedOrder = await queryRunner.manager.save(order);

            const orderLines = lines.map((line) =>
                queryRunner.manager.create(PurchaseOrderLine, {
                    ...line,
                    orderId: savedOrder.id,
                    companyId,
                    subtotal: line.quantity * line.unitPrice,
                }),
            );

            await queryRunner.manager.save(orderLines);

            const totalAmount = orderLines.reduce((acc, line) => acc + Number(line.subtotal), 0);
            savedOrder.totalAmount = totalAmount;
            await queryRunner.manager.save(savedOrder);

            await queryRunner.commitTransaction();

            return await this.purchaseOrderRepository.findOneByCompanyWithRelations(savedOrder.id, companyId) as PurchaseOrder;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}

import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import type { ISalesOrderRepository } from '../../domain/repositories/sales-order.repository.interface';
import { SalesOrder } from '../../domain/entities/sales-order.entity';
import { SalesOrderLine } from '../../domain/entities/sales-order-line.entity';
import { CreateSalesOrderDto } from '../../dto/create-sales-order.dto';

@Injectable()
export class CreateSalesOrderUseCase {
    constructor(
        @Inject('ISalesOrderRepository')
        private readonly salesOrderRepository: ISalesOrderRepository,
        private readonly dataSource: DataSource,
    ) { }

    async execute(companyId: string, dto: CreateSalesOrderDto, userId: string): Promise<SalesOrder> {
        const { lines, ...orderData } = dto;

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const order = queryRunner.manager.create(SalesOrder, {
                ...orderData,
                companyId,
                createdBy: userId,
                state: 'draft',
            });

            const savedOrder = await queryRunner.manager.save(order);

            const orderLines = lines.map((line) =>
                queryRunner.manager.create(SalesOrderLine, {
                    ...line,
                    orderId: savedOrder.id,
                    companyId,
                    subtotal: line.quantity * line.unitPrice * (1 - (line.discount || 0) / 100),
                }),
            );

            await queryRunner.manager.save(orderLines);

            const totalAmount = orderLines.reduce((acc, line) => acc + Number(line.subtotal), 0);
            savedOrder.totalAmount = totalAmount;
            savedOrder.untaxedAmount = totalAmount;
            await queryRunner.manager.save(savedOrder);

            await queryRunner.commitTransaction();

            return await this.salesOrderRepository.findOneByCompanyWithRelations(savedOrder.id, companyId) as SalesOrder;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}

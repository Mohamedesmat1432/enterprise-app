import { Injectable } from '@nestjs/common';
import { CreateSalesOrderUseCase } from '../application/use-cases/create-sales-order.use-case';
import { GetSalesOrdersUseCase } from '../application/use-cases/get-sales-orders.use-case';
import { GetSalesOrderUseCase } from '../application/use-cases/get-sales-order.use-case';
import { ConfirmSalesOrderUseCase } from '../application/use-cases/confirm-sales-order.use-case';
import { CreateInvoiceFromOrderUseCase } from '../application/use-cases/create-invoice-from-order.use-case';
import { CreateSalesOrderDto } from '../dto/create-sales-order.dto';

@Injectable()
export class SalesService {
    constructor(
        private readonly createUseCase: CreateSalesOrderUseCase,
        private readonly getOrdersUseCase: GetSalesOrdersUseCase,
        private readonly getOrderUseCase: GetSalesOrderUseCase,
        private readonly confirmUseCase: ConfirmSalesOrderUseCase,
        private readonly createInvoiceUseCase: CreateInvoiceFromOrderUseCase,
    ) { }

    async create(createSalesOrderDto: CreateSalesOrderDto, companyId: string, userId: string) {
        return this.createUseCase.execute(companyId, createSalesOrderDto, userId);
    }

    async confirmOrder(companyId: string, orderId: string, userId: string) {
        return this.confirmUseCase.execute(companyId, orderId, userId);
    }

    async createInvoiceFromOrder(companyId: string, orderId: string, userId: string) {
        return this.createInvoiceUseCase.execute(companyId, orderId);
    }

    async findAll(companyId: string) {
        return this.getOrdersUseCase.execute(companyId);
    }

    async findOne(id: string, companyId: string) {
        return this.getOrderUseCase.execute(id, companyId);
    }
}

import { Injectable } from '@nestjs/common';
import { CreatePurchaseOrderUseCase } from '../application/use-cases/create-purchase-order.use-case';
import { GetPurchaseOrdersUseCase } from '../application/use-cases/get-purchase-orders.use-case';
import { GetPurchaseOrderUseCase } from '../application/use-cases/get-purchase-order.use-case';
import { ConfirmPurchaseOrderUseCase } from '../application/use-cases/confirm-purchase-order.use-case';
import { CreateBillFromOrderUseCase } from '../application/use-cases/create-bill-from-order.use-case';
import { CreatePurchaseOrderDto } from '../dto/create-purchase-order.dto';

@Injectable()
export class PurchasesService {
    constructor(
        private readonly createUseCase: CreatePurchaseOrderUseCase,
        private readonly getOrdersUseCase: GetPurchaseOrdersUseCase,
        private readonly getOrderUseCase: GetPurchaseOrderUseCase,
        private readonly confirmUseCase: ConfirmPurchaseOrderUseCase,
        private readonly createBillUseCase: CreateBillFromOrderUseCase,
    ) { }

    async create(createPurchaseOrderDto: CreatePurchaseOrderDto, companyId: string, userId: string) {
        return this.createUseCase.execute(companyId, createPurchaseOrderDto, userId);
    }

    async confirmOrder(companyId: string, orderId: string, userId: string) {
        return this.confirmUseCase.execute(companyId, orderId, userId);
    }

    async createBillFromOrder(companyId: string, orderId: string, userId: string) {
        return this.createBillUseCase.execute(companyId, orderId);
    }

    async findAll(companyId: string) {
        return this.getOrdersUseCase.execute(companyId);
    }

    async findOne(id: string, companyId: string) {
        return this.getOrderUseCase.execute(id, companyId);
    }
}

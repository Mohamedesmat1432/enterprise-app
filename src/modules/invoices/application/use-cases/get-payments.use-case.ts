
import { Injectable, Inject } from '@nestjs/common';
import type { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { Payment } from '../../domain/entities/payment.entity';

@Injectable()
export class GetPaymentsUseCase {
    constructor(
        @Inject('IPaymentRepository')
        private readonly paymentRepository: IPaymentRepository,
    ) { }

    async execute(companyId: string): Promise<Payment[]> {
        return await this.paymentRepository.findAllPaginated(companyId);
    }
}

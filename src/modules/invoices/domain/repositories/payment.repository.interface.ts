
import { Payment } from '../entities/payment.entity';
import { IRepository } from '@core/domain/repositories/base-repository.interface';

export interface IPaymentRepository extends IRepository<Payment> {
    findAllPaginated(companyId: string): Promise<Payment[]>;
}

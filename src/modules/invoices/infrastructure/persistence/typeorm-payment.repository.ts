
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../../domain/entities/payment.entity';
import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { BaseTenantTypeOrmRepository } from '@core/infrastructure/persistence/base-typeorm.repository';

@Injectable()
export class TypeOrmPaymentRepository
    extends BaseTenantTypeOrmRepository<Payment>
    implements IPaymentRepository {
    constructor(
        @InjectRepository(Payment)
        repository: Repository<Payment>,
    ) {
        super(repository);
    }

    async findAllPaginated(companyId: string): Promise<Payment[]> {
        return this.repository.find({
            where: { companyId },
            relations: ['partner', 'invoice'],
        });
    }
}

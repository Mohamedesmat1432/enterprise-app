
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../domain/entities/account.entity';
import { IAccountRepository } from '../../domain/repositories/account.repository.interface';
import { BaseTenantTypeOrmRepository } from '@core/infrastructure/persistence/base-typeorm.repository';
import { PaginatedResponse } from '@common/dto/pagination.dto';

@Injectable()
export class TypeOrmAccountRepository
    extends BaseTenantTypeOrmRepository<Account>
    implements IAccountRepository {
    constructor(
        @InjectRepository(Account)
        repository: Repository<Account>,
    ) {
        super(repository);
    }

    async findByCode(companyId: string, code: string): Promise<Account | null> {
        return this.repository.findOne({ where: { companyId, code } });
    }

    async findAllPaginated(companyId: string, page: number, limit: number): Promise<PaginatedResponse<Account>> {
        const skip = (page - 1) * limit;

        const [data, total] = await this.repository.findAndCount({
            where: { companyId },
            skip,
            take: limit,
        });

        const totalPages = Math.ceil(total / limit);
        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        };
    }

    async getProfitAndLoss(companyId: string, startDate: Date, endDate: Date): Promise<any> {
        const stats = await this.repository
            .createQueryBuilder('account')
            .leftJoin('account.entries', 'entry')
            .select('account.type', 'type')
            .addSelect('SUM(CAST(entry.credit AS DECIMAL) - CAST(entry.debit AS DECIMAL))', 'balance')
            .where('account.company_id = :companyId', { companyId })
            .andWhere('entry.created_at BETWEEN :startDate AND :endDate', { startDate, endDate })
            .groupBy('account.type')
            .getRawMany();

        let revenue = 0;
        let expenses = 0;

        stats.forEach(s => {
            const balance = Number(s.balance || 0);
            if (s.type === 'income') revenue += balance;
            if (s.type === 'expense') expenses += Math.abs(balance);
        });

        return {
            revenue,
            expenses,
            netProfit: revenue - expenses,
            period: { startDate, endDate },
        };
    }

    async getBalanceSheet(companyId: string): Promise<any> {
        const stats = await this.repository
            .createQueryBuilder('account')
            .leftJoin('account.entries', 'entry')
            .select('account.type', 'type')
            .addSelect('SUM(CAST(entry.debit AS DECIMAL) - CAST(entry.credit AS DECIMAL))', 'balance')
            .where('account.company_id = :companyId', { companyId })
            .groupBy('account.type')
            .getRawMany();

        let assets = 0;
        let liabilities = 0;
        let equity = 0;

        stats.forEach(s => {
            const balance = Number(s.balance || 0);
            if (s.type === 'asset') assets += balance;
            if (s.type === 'liability') liabilities += Math.abs(balance);
            if (s.type === 'equity') equity += Math.abs(balance);
        });

        return {
            assets,
            liabilities,
            equity,
            isBalanced: Math.abs(assets - (liabilities + equity)) < 0.01,
        };
    }
}


import { Account } from '../entities/account.entity';
import { CreateAccountDto } from '../../dto/accounting.dto';
import { IRepository } from '@core/domain/repositories/base-repository.interface';
import { PaginatedResponse } from '@common/dto/pagination.dto';

export interface IAccountRepository extends IRepository<Account> {
    create(data: Account): Promise<Account>;
    findAllPaginated(companyId: string, page: number, limit: number): Promise<PaginatedResponse<Account>>;
    findByCode(companyId: string, code: string): Promise<Account | null>;
    getProfitAndLoss(companyId: string, startDate: Date, endDate: Date): Promise<any>;
    getBalanceSheet(companyId: string): Promise<any>;
}

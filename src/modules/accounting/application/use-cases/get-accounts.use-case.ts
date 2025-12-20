import { Injectable, Inject } from '@nestjs/common';
import type { IAccountRepository } from '../../domain/repositories/account.repository.interface';
import { Account } from '../../domain/entities/account.entity';
import { PaginatedResponse } from '@common/dto/pagination.dto';

@Injectable()
export class GetAccountsUseCase {
    constructor(
        @Inject('IAccountRepository')
        private readonly accountRepository: IAccountRepository,
    ) { }

    async execute(companyId: string, page: number, limit: number): Promise<PaginatedResponse<Account>> {
        return await this.accountRepository.findAllPaginated(companyId, page, limit);
    }
}

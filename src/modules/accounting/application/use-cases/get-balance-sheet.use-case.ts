
import { Injectable, Inject } from '@nestjs/common';
import type { IAccountRepository } from '../../domain/repositories/account.repository.interface';

@Injectable()
export class GetBalanceSheetUseCase {
    constructor(
        @Inject('IAccountRepository')
        private readonly accountRepository: IAccountRepository,
    ) { }

    async execute(companyId: string) {
        return await this.accountRepository.getBalanceSheet(companyId);
    }
}


import { Injectable, Inject } from '@nestjs/common';
import type { IAccountRepository } from '../../domain/repositories/account.repository.interface';

@Injectable()
export class GetProfitAndLossUseCase {
    constructor(
        @Inject('IAccountRepository')
        private readonly accountRepository: IAccountRepository,
    ) { }

    async execute(companyId: string, startDate: Date, endDate: Date) {
        return await this.accountRepository.getProfitAndLoss(companyId, startDate, endDate);
    }
}


import { Injectable, Inject } from '@nestjs/common';
import type { IAccountRepository } from '../../domain/repositories/account.repository.interface';
import { Account } from '../../domain/entities/account.entity';

@Injectable()
export class GetAccountByCodeUseCase {
    constructor(
        @Inject('IAccountRepository')
        private readonly accountRepository: IAccountRepository,
    ) { }

    async execute(companyId: string, code: string): Promise<Account | null> {
        return await this.accountRepository.findByCode(companyId, code);
    }
}

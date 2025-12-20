
import { Injectable, Inject } from '@nestjs/common';
import type { IAccountRepository } from '../../domain/repositories/account.repository.interface';
import { CreateAccountDto } from '../../dto/accounting.dto';
import { Account } from '../../domain/entities/account.entity';

@Injectable()
export class CreateAccountUseCase {
    constructor(
        @Inject('IAccountRepository')
        private readonly accountRepository: IAccountRepository,
    ) { }

    async execute(companyId: string, dto: CreateAccountDto): Promise<Account> {
        // Create pure entity instance (adapting DTO to Entity)
        // Here we might need a mapper, but closely following simple pattern:
        const account = new Account();
        Object.assign(account, dto);
        account.companyId = companyId;

        return await this.accountRepository.create(account);
    }
}

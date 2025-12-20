
import { Injectable } from '@nestjs/common';
import { GenerateDoubleEntryUseCase } from '../application/use-cases/generate-double-entry.use-case';
import { CreateAccountUseCase } from '../application/use-cases/create-account.use-case';
import { CreateJournalUseCase } from '../application/use-cases/create-journal.use-case';
import { GetAccountsUseCase } from '../application/use-cases/get-accounts.use-case';
import { GetJournalsUseCase } from '../application/use-cases/get-journals.use-case';
import { GetProfitAndLossUseCase } from '../application/use-cases/get-profit-and-loss.use-case';
import { GetBalanceSheetUseCase } from '../application/use-cases/get-balance-sheet.use-case';
import { GetAccountByCodeUseCase } from '../application/use-cases/get-account-by-code.use-case';
import { CreateAccountDto, CreateJournalDto } from '../dto/accounting.dto';

@Injectable()
export class AccountingService {
    constructor(
        private readonly generateDoubleEntryUseCase: GenerateDoubleEntryUseCase,
        private readonly createAccountUseCase: CreateAccountUseCase,
        private readonly createJournalUseCase: CreateJournalUseCase,
        private readonly getAccountsUseCase: GetAccountsUseCase,
        private readonly getJournalsUseCase: GetJournalsUseCase,
        private readonly getProfitAndLossUseCase: GetProfitAndLossUseCase,
        private readonly getBalanceSheetUseCase: GetBalanceSheetUseCase,
        private readonly getAccountByCodeUseCase: GetAccountByCodeUseCase,
    ) { }

    async createAccount(companyId: string, dto: CreateAccountDto) {
        return this.createAccountUseCase.execute(companyId, dto);
    }

    async findAccountByCode(companyId: string, code: string) {
        return this.getAccountByCodeUseCase.execute(companyId, code);
    }

    async findAllAccounts(companyId: string, page: number = 1, limit: number = 10) {
        return this.getAccountsUseCase.execute(companyId, page, limit);
    }

    async createJournal(companyId: string, dto: CreateJournalDto) {
        return this.createJournalUseCase.execute(companyId, dto);
    }

    async findAllJournals(companyId: string, page: number = 1, limit: number = 10) {
        return this.getJournalsUseCase.execute(companyId, page, limit);
    }

    async generateDoubleEntry(
        companyId: string,
        journalName: string,
        date: Date,
        entries: { accountId: string; debit: number; credit: number }[],
    ) {
        return this.generateDoubleEntryUseCase.execute(companyId, journalName, date, entries);
    }

    async getProfitAndLoss(companyId: string, startDate: Date, endDate: Date) {
        return this.getProfitAndLossUseCase.execute(companyId, startDate, endDate);
    }

    async getBalanceSheet(companyId: string) {
        return this.getBalanceSheetUseCase.execute(companyId);
    }
}

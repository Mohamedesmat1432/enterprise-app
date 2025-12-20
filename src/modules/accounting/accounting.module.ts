
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './domain/entities/account.entity';
import { Journal } from './domain/entities/journal.entity';
import { JournalEntry } from './domain/entities/journal-entry.entity';
import { AccountingController } from './controllers/accounting.controller';
import { TypeOrmAccountRepository } from './infrastructure/persistence/typeorm-account.repository';
import { TypeOrmJournalRepository } from './infrastructure/persistence/typeorm-journal.repository';
import { CreateAccountUseCase } from './application/use-cases/create-account.use-case';
import { GetAccountsUseCase } from './application/use-cases/get-accounts.use-case';
import { CreateJournalUseCase } from './application/use-cases/create-journal.use-case';
import { GetJournalsUseCase } from './application/use-cases/get-journals.use-case';
import { GetProfitAndLossUseCase } from './application/use-cases/get-profit-and-loss.use-case';
import { GetBalanceSheetUseCase } from './application/use-cases/get-balance-sheet.use-case';
import { GetAccountByCodeUseCase } from './application/use-cases/get-account-by-code.use-case';
import { GenerateDoubleEntryUseCase } from './application/use-cases/generate-double-entry.use-case';
import { AccountingService } from './services/accounting.service';

@Module({
    imports: [TypeOrmModule.forFeature([Account, Journal, JournalEntry])],
    controllers: [AccountingController],
    providers: [
        {
            provide: 'IAccountRepository',
            useClass: TypeOrmAccountRepository,
        },
        {
            provide: 'IJournalRepository',
            useClass: TypeOrmJournalRepository,
        },
        CreateAccountUseCase,
        GetAccountsUseCase,
        CreateJournalUseCase,
        GetJournalsUseCase,
        GetProfitAndLossUseCase,
        GetBalanceSheetUseCase,
        GetAccountByCodeUseCase,
        GenerateDoubleEntryUseCase,
        AccountingService,
    ],
    exports: [
        CreateAccountUseCase,
        GetAccountsUseCase,
        CreateJournalUseCase,
        GetJournalsUseCase,
        GetProfitAndLossUseCase,
        GetBalanceSheetUseCase,
        GetAccountByCodeUseCase,
        GenerateDoubleEntryUseCase,
        AccountingService,
    ],
})
export class AccountingModule { }

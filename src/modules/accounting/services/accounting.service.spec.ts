import { Test, TestingModule } from '@nestjs/testing';
import { AccountingService } from './accounting.service';
import { GenerateDoubleEntryUseCase } from '../application/use-cases/generate-double-entry.use-case';
import { CreateAccountUseCase } from '../application/use-cases/create-account.use-case';
import { CreateJournalUseCase } from '../application/use-cases/create-journal.use-case';
import { GetAccountsUseCase } from '../application/use-cases/get-accounts.use-case';
import { GetJournalsUseCase } from '../application/use-cases/get-journals.use-case';
import { GetProfitAndLossUseCase } from '../application/use-cases/get-profit-and-loss.use-case';
import { GetBalanceSheetUseCase } from '../application/use-cases/get-balance-sheet.use-case';
import { GetAccountByCodeUseCase } from '../application/use-cases/get-account-by-code.use-case';

describe('AccountingService', () => {
    let service: AccountingService;
    let generateDoubleEntryUseCase: jest.Mocked<GenerateDoubleEntryUseCase>;
    let createAccountUseCase: jest.Mocked<CreateAccountUseCase>;
    let createJournalUseCase: jest.Mocked<CreateJournalUseCase>;
    let getAccountsUseCase: jest.Mocked<GetAccountsUseCase>;
    let getJournalsUseCase: jest.Mocked<GetJournalsUseCase>;
    let getProfitAndLossUseCase: jest.Mocked<GetProfitAndLossUseCase>;
    let getBalanceSheetUseCase: jest.Mocked<GetBalanceSheetUseCase>;
    let getAccountByCodeUseCase: jest.Mocked<GetAccountByCodeUseCase>;

    const companyId = 'test-company-id';

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AccountingService,
                { provide: GenerateDoubleEntryUseCase, useValue: { execute: jest.fn() } },
                { provide: CreateAccountUseCase, useValue: { execute: jest.fn() } },
                { provide: CreateJournalUseCase, useValue: { execute: jest.fn() } },
                { provide: GetAccountsUseCase, useValue: { execute: jest.fn() } },
                { provide: GetJournalsUseCase, useValue: { execute: jest.fn() } },
                { provide: GetProfitAndLossUseCase, useValue: { execute: jest.fn() } },
                { provide: GetBalanceSheetUseCase, useValue: { execute: jest.fn() } },
                { provide: GetAccountByCodeUseCase, useValue: { execute: jest.fn() } },
            ],
        }).compile();

        service = module.get<AccountingService>(AccountingService);
        generateDoubleEntryUseCase = module.get(GenerateDoubleEntryUseCase);
        createAccountUseCase = module.get(CreateAccountUseCase);
        createJournalUseCase = module.get(CreateJournalUseCase);
        getAccountsUseCase = module.get(GetAccountsUseCase);
        getJournalsUseCase = module.get(GetJournalsUseCase);
        getProfitAndLossUseCase = module.get(GetProfitAndLossUseCase);
        getBalanceSheetUseCase = module.get(GetBalanceSheetUseCase);
        getAccountByCodeUseCase = module.get(GetAccountByCodeUseCase);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createAccount', () => {
        it('should delegate to CreateAccountUseCase', async () => {
            const dto = { code: '1000', name: 'Cash', type: 'asset' as const };
            const expected = { id: '1', ...dto };
            createAccountUseCase.execute.mockResolvedValue(expected as any);

            const result = await service.createAccount(companyId, dto);

            expect(createAccountUseCase.execute).toHaveBeenCalledWith(companyId, dto);
            expect(result).toEqual(expected);
        });
    });

    describe('findAccountByCode', () => {
        it('should delegate to GetAccountByCodeUseCase', async () => {
            const expected = { id: '1', code: '1000', name: 'Cash' };
            getAccountByCodeUseCase.execute.mockResolvedValue(expected as any);

            const result = await service.findAccountByCode(companyId, '1000');

            expect(getAccountByCodeUseCase.execute).toHaveBeenCalledWith(companyId, '1000');
            expect(result).toEqual(expected);
        });
    });

    describe('findAllAccounts', () => {
        it('should delegate to GetAccountsUseCase with pagination', async () => {
            const accounts = [{ id: '1', code: '1000', name: 'Cash' }];
            const expected = {
                data: accounts,
                meta: { total: 1, page: 1, limit: 10, totalPages: 1, hasNext: false, hasPrev: false }
            };
            getAccountsUseCase.execute.mockResolvedValue(expected as any);

            const result = await service.findAllAccounts(companyId);

            expect(getAccountsUseCase.execute).toHaveBeenCalledWith(companyId, 1, 10);
            expect(result).toEqual(expected);
        });
    });

    describe('createJournal', () => {
        it('should delegate to CreateJournalUseCase', async () => {
            const dto = { name: 'Sales Journal', date: '2024-01-01' };
            const expected = { id: '1', ...dto };
            createJournalUseCase.execute.mockResolvedValue(expected as any);

            const result = await service.createJournal(companyId, dto);

            expect(createJournalUseCase.execute).toHaveBeenCalledWith(companyId, dto);
            expect(result).toEqual(expected);
        });
    });

    describe('findAllJournals', () => {
        it('should delegate to GetJournalsUseCase with pagination', async () => {
            const journals = [{ id: '1', name: 'Sales Journal' }];
            const expected = {
                data: journals,
                meta: { total: 1, page: 1, limit: 10, totalPages: 1, hasNext: false, hasPrev: false }
            };
            getJournalsUseCase.execute.mockResolvedValue(expected as any);

            const result = await service.findAllJournals(companyId);

            expect(getJournalsUseCase.execute).toHaveBeenCalledWith(companyId, 1, 10);
            expect(result).toEqual(expected);
        });
    });

    describe('generateDoubleEntry', () => {
        it('should delegate to GenerateDoubleEntryUseCase', async () => {
            const entries = [
                { accountId: '1', debit: 100, credit: 0 },
                { accountId: '2', debit: 0, credit: 100 },
            ];
            const date = new Date();
            const expected = { id: '1', entries };
            generateDoubleEntryUseCase.execute.mockResolvedValue(expected as any);

            const result = await service.generateDoubleEntry(companyId, 'Sales', date, entries);

            expect(generateDoubleEntryUseCase.execute).toHaveBeenCalledWith(companyId, 'Sales', date, entries);
            expect(result).toEqual(expected);
        });
    });

    describe('getProfitAndLoss', () => {
        it('should delegate to GetProfitAndLossUseCase', async () => {
            const startDate = new Date('2024-01-01');
            const endDate = new Date('2024-12-31');
            const expected = { income: 1000, expenses: 500, netIncome: 500 };
            getProfitAndLossUseCase.execute.mockResolvedValue(expected as any);

            const result = await service.getProfitAndLoss(companyId, startDate, endDate);

            expect(getProfitAndLossUseCase.execute).toHaveBeenCalledWith(companyId, startDate, endDate);
            expect(result).toEqual(expected);
        });
    });

    describe('getBalanceSheet', () => {
        it('should delegate to GetBalanceSheetUseCase', async () => {
            const expected = { assets: 10000, liabilities: 5000, equity: 5000 };
            getBalanceSheetUseCase.execute.mockResolvedValue(expected as any);

            const result = await service.getBalanceSheet(companyId);

            expect(getBalanceSheetUseCase.execute).toHaveBeenCalledWith(companyId);
            expect(result).toEqual(expected);
        });
    });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AccountingController } from './accounting.controller';
import { CreateAccountUseCase } from '../application/use-cases/create-account.use-case';
import { GetAccountsUseCase } from '../application/use-cases/get-accounts.use-case';
import { CreateJournalUseCase } from '../application/use-cases/create-journal.use-case';
import { GetJournalsUseCase } from '../application/use-cases/get-journals.use-case';
import { GetProfitAndLossUseCase } from '../application/use-cases/get-profit-and-loss.use-case';
import { GetBalanceSheetUseCase } from '../application/use-cases/get-balance-sheet.use-case';

describe('AccountingController', () => {
    let controller: AccountingController;
    let createAccountUseCase: jest.Mocked<CreateAccountUseCase>;
    let getAccountsUseCase: jest.Mocked<GetAccountsUseCase>;
    let createJournalUseCase: jest.Mocked<CreateJournalUseCase>;
    let getJournalsUseCase: jest.Mocked<GetJournalsUseCase>;
    let getProfitAndLossUseCase: jest.Mocked<GetProfitAndLossUseCase>;
    let getBalanceSheetUseCase: jest.Mocked<GetBalanceSheetUseCase>;

    const mockRequest = { user: { companyId: 'test-company-id' } };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AccountingController],
            providers: [
                {
                    provide: CreateAccountUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: GetAccountsUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: CreateJournalUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: GetJournalsUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: GetProfitAndLossUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: GetBalanceSheetUseCase,
                    useValue: { execute: jest.fn() },
                },
            ],
        }).compile();

        controller = module.get<AccountingController>(AccountingController);
        createAccountUseCase = module.get(CreateAccountUseCase);
        getAccountsUseCase = module.get(GetAccountsUseCase);
        createJournalUseCase = module.get(CreateJournalUseCase);
        getJournalsUseCase = module.get(GetJournalsUseCase);
        getProfitAndLossUseCase = module.get(GetProfitAndLossUseCase);
        getBalanceSheetUseCase = module.get(GetBalanceSheetUseCase);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('createAccount', () => {
        it('should create an account', async () => {
            const dto = { code: '1000', name: 'Cash', type: 'asset' as const };
            const expected = { id: '1', ...dto };
            createAccountUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.createAccount(mockRequest, dto);

            expect(createAccountUseCase.execute).toHaveBeenCalledWith('test-company-id', dto);
            expect(result).toEqual(expected);
        });
    });

    describe('findAllAccounts', () => {
        it('should return all accounts', async () => {
            const accounts = [{ id: '1', code: '1000', name: 'Cash' }];
            const expected = {
                data: accounts,
                meta: { total: 1, page: 1, limit: 10, totalPages: 1, hasNext: false, hasPrev: false }
            };
            getAccountsUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.findAllAccounts(mockRequest);

            expect(getAccountsUseCase.execute).toHaveBeenCalledWith('test-company-id', 1, 10);
            expect(result).toEqual(expected);
        });
    });

    describe('createJournal', () => {
        it('should create a journal', async () => {
            const dto = { name: 'Sales Journal', date: '2024-01-01' };
            const expected = { id: '1', ...dto };
            createJournalUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.createJournal(mockRequest, dto);

            expect(createJournalUseCase.execute).toHaveBeenCalledWith('test-company-id', dto);
            expect(result).toEqual(expected);
        });
    });

    describe('findAllJournals', () => {
        it('should return all journals', async () => {
            const journals = [{ id: '1', name: 'Sales Journal' }];
            const expected = {
                data: journals,
                meta: { total: 1, page: 1, limit: 10, totalPages: 1, hasNext: false, hasPrev: false }
            };
            getJournalsUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.findAllJournals(mockRequest);

            expect(getJournalsUseCase.execute).toHaveBeenCalledWith('test-company-id', 1, 10);
            expect(result).toEqual(expected);
        });
    });

    describe('getProfitAndLoss', () => {
        it('should return profit and loss report', async () => {
            const expected = { income: 1000, expenses: 500, netIncome: 500 };
            getProfitAndLossUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.getProfitAndLoss(mockRequest, '2024-01-01', '2024-12-31');

            expect(getProfitAndLossUseCase.execute).toHaveBeenCalledWith(
                'test-company-id',
                expect.any(Date),
                expect.any(Date),
            );
            expect(result).toEqual(expected);
        });

        it('should use default dates when not provided', async () => {
            const expected = { income: 1000, expenses: 500, netIncome: 500 };
            getProfitAndLossUseCase.execute.mockResolvedValue(expected as any);

            await controller.getProfitAndLoss(mockRequest);

            expect(getProfitAndLossUseCase.execute).toHaveBeenCalledWith(
                'test-company-id',
                expect.any(Date),
                expect.any(Date),
            );
        });
    });

    describe('getBalanceSheet', () => {
        it('should return balance sheet report', async () => {
            const expected = { assets: 10000, liabilities: 5000, equity: 5000 };
            getBalanceSheetUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.getBalanceSheet(mockRequest);

            expect(getBalanceSheetUseCase.execute).toHaveBeenCalledWith('test-company-id');
            expect(result).toEqual(expected);
        });
    });
});

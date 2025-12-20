
import { Controller, Get, Post, Body, UseGuards, Req, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateAccountDto, CreateJournalDto } from '../dto/accounting.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { Permissions } from '@modules/auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '@modules/auth/guards/permissions.guard';
import { CreateAccountUseCase } from '../application/use-cases/create-account.use-case';
import { GetAccountsUseCase } from '../application/use-cases/get-accounts.use-case';
import { CreateJournalUseCase } from '../application/use-cases/create-journal.use-case';
import { GetJournalsUseCase } from '../application/use-cases/get-journals.use-case';
import { GetProfitAndLossUseCase } from '../application/use-cases/get-profit-and-loss.use-case';
import { GetBalanceSheetUseCase } from '../application/use-cases/get-balance-sheet.use-case';

@ApiTags('Accounting')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('accounting')
export class AccountingController {
    constructor(
        private readonly createAccountUseCase: CreateAccountUseCase,
        private readonly getAccountsUseCase: GetAccountsUseCase,
        private readonly createJournalUseCase: CreateJournalUseCase,
        private readonly getJournalsUseCase: GetJournalsUseCase,
        private readonly getProfitAndLossUseCase: GetProfitAndLossUseCase,
        private readonly getBalanceSheetUseCase: GetBalanceSheetUseCase,
    ) { }

    @Post('accounts')
    @Permissions('create.accounts')
    @ApiOperation({ summary: 'Create a new account' })
    async createAccount(@Req() req: any, @Body() dto: CreateAccountDto) {
        return await this.createAccountUseCase.execute(req.user.companyId, dto);
    }

    @Get('accounts')
    @Permissions('read.accounts')
    @ApiOperation({ summary: 'Get all accounts' })
    async findAllAccounts(@Req() req: any, @Query() pagination: PaginationDto = new PaginationDto()) {
        return await this.getAccountsUseCase.execute(
            req.user.companyId,
            pagination.page ?? 1,
            pagination.limit ?? 10,
        );
    }

    @Post('journals')
    @Permissions('create.journals')
    @ApiOperation({ summary: 'Create a new journal' })
    async createJournal(@Req() req: any, @Body() dto: CreateJournalDto) {
        return await this.createJournalUseCase.execute(req.user.companyId, dto);
    }

    @Get('journals')
    @Permissions('read.journals')
    @ApiOperation({ summary: 'Get all journals' })
    async findAllJournals(@Req() req: any, @Query() pagination: PaginationDto = new PaginationDto()) {
        return await this.getJournalsUseCase.execute(
            req.user.companyId,
            pagination.page ?? 1,
            pagination.limit ?? 10,
        );
    }

    @Get('reports/profit-loss')
    @Permissions('read.reports')
    @ApiOperation({ summary: 'Get Profit and Loss report' })
    async getProfitAndLoss(
        @Req() req: any,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1);
        const end = endDate ? new Date(endDate) : new Date();
        return await this.getProfitAndLossUseCase.execute(req.user.companyId, start, end);
    }

    @Get('reports/balance-sheet')
    @Permissions('read.reports')
    @ApiOperation({ summary: 'Get Balance Sheet report' })
    async getBalanceSheet(@Req() req: any) {
        return await this.getBalanceSheetUseCase.execute(req.user.companyId);
    }
}

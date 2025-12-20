import { Controller, Get, Req, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import type { Request } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { AccountingService } from '@modules/accounting/services/accounting.service';
import { Permissions } from '@modules/auth/decorators/permissions.decorator';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
    constructor(
        private readonly dashboardService: DashboardService,
        private readonly accountingService: AccountingService,
    ) { }

    @Get('stats')
    @Permissions('read.dashboard')
    @ApiOperation({ summary: 'Get dashboard statistics' })
    async getStats(@Req() req: Request) {
        return this.dashboardService.getStats((req.user as any).companyId);
    }

    @Get('reports/pl')
    @Permissions('read.reports')
    @ApiOperation({ summary: 'Get Profit & Loss report' })
    @ApiQuery({ name: 'startDate', required: false })
    @ApiQuery({ name: 'endDate', required: false })
    async getPL(
        @Req() req: Request,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1);
        const end = endDate ? new Date(endDate) : new Date();
        return this.accountingService.getProfitAndLoss((req.user as any).companyId, start, end);
    }

    @Get('reports/balance-sheet')
    @Permissions('read.reports')
    @ApiOperation({ summary: 'Get Balance Sheet report' })
    async getBalanceSheet(@Req() req: Request) {
        return this.accountingService.getBalanceSheet((req.user as any).companyId);
    }
}

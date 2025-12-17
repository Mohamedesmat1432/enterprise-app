import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from '@modules/auth/decorators/permissions.decorator';
import { DashboardService } from '../services/dashboard.service';

@ApiTags('dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('stats')
    @Permissions('read.dashboard')
    @ApiOperation({ summary: 'Get system dashboard stats' })
    @ApiResponse({ status: 200, description: 'Return dashboard statistics.' })
    getStats() {
        return this.dashboardService.getStats();
    }
}

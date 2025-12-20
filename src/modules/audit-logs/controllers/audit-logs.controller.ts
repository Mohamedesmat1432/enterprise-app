
import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { GetAuditLogsUseCase } from '../application/use-cases/get-audit-logs.use-case';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '@modules/auth/guards/permissions.guard';
import { Permissions } from '@modules/auth/decorators/permissions.decorator';
import { PaginationDto } from '@common/dto/pagination.dto';

@ApiTags('Audit Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('audit-logs')
export class AuditLogsController {
    constructor(private readonly getAuditLogsUseCase: GetAuditLogsUseCase) { }

    @Get()
    @Permissions('read.audit_logs')
    @ApiOperation({ summary: 'Get all audit logs' })
    @Get()
    @Permissions('read.audit_logs')
    @ApiOperation({ summary: 'Get all audit logs' })
    async findAll(@Req() req: any, @Query() pagination: PaginationDto = new PaginationDto()) {
        return await this.getAuditLogsUseCase.execute(
            req.user.companyId,
            pagination.page ?? 1,
            pagination.limit ?? 10,
        );
    }
}

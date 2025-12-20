import { Controller, Get, Post, Body, Param, UseGuards, Req, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TaxesService } from '@modules/taxes/services/taxes.service';
import { CreateTaxDto } from '@modules/taxes/dto/tax.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '@modules/auth/guards/permissions.guard';
import { Permissions } from '@modules/auth/decorators/permissions.decorator';

@ApiTags('Taxes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('taxes')
export class TaxesController {
    constructor(private readonly taxesService: TaxesService) { }

    @Post()
    @Permissions('create.taxes')
    @ApiOperation({ summary: 'Create a new tax' })
    async create(@Req() req: any, @Body() dto: CreateTaxDto) {
        return await this.taxesService.create(req.user.companyId, dto);
    }

    @Get()
    @Permissions('read.taxes')
    @ApiOperation({ summary: 'Get all taxes' })
    async findAll(@Req() req: any, @Query('type') type?: 'sale' | 'purchase') {
        return await this.taxesService.findAll(req.user.companyId, type);
    }

    @Get(':id')
    @Permissions('read.taxes')
    @ApiOperation({ summary: 'Get a tax by ID' })
    async findOne(@Req() req: any, @Param('id') id: string) {
        return await this.taxesService.findOne(id, req.user.companyId);
    }
}

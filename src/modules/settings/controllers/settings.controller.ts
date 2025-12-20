import { Controller, Get, Patch, Param, Body, UseGuards, Req, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '@modules/auth/guards/permissions.guard';
import { Permissions } from '@modules/auth/decorators/permissions.decorator';
import { GetSettingsUseCase } from '../application/use-cases/get-settings.use-case';
import { GetSettingUseCase } from '../application/use-cases/get-setting.use-case';
import { UpdateSettingUseCase } from '../application/use-cases/update-setting.use-case';
import { SettingQueryDto } from '../dto/setting-query.dto';
import { UpdateSettingDto } from '../dto/update-setting.dto';

@ApiTags('Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('settings')
export class SettingsController {
    constructor(
        private readonly getSettingsUseCase: GetSettingsUseCase,
        private readonly getSettingUseCase: GetSettingUseCase,
        private readonly updateSettingUseCase: UpdateSettingUseCase,
    ) { }

    @Get()
    @Permissions('read.settings')
    @ApiOperation({ summary: 'Get all settings (paginated)' })
    async findAll(@Req() req: any, @Query() query: SettingQueryDto) {
        return await this.getSettingsUseCase.execute(query, req.user.companyId);
    }

    @Get(':id')
    @Permissions('read.settings')
    @ApiOperation({ summary: 'Get a single setting' })
    async findOne(@Req() req: any, @Param('id') id: string) {
        return await this.getSettingUseCase.execute(id, req.user.companyId);
    }

    @Get('key/:key')
    @Permissions('read.settings')
    @ApiOperation({ summary: 'Get a setting by key' })
    async findByKey(@Req() req: any, @Param('key') key: string) {
        return await this.getSettingUseCase.executeByKey(key, req.user.companyId);
    }

    @Patch(':id')
    @Permissions('update.settings')
    @ApiOperation({ summary: 'Update a setting' })
    async update(
        @Req() req: any,
        @Param('id') id: string,
        @Body() updateSettingDto: UpdateSettingDto,
    ) {
        return await this.updateSettingUseCase.execute(id, updateSettingDto, req.user.companyId);
    }
}

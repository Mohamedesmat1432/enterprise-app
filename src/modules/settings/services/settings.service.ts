import { Injectable, Inject } from '@nestjs/common';
import { GetSettingsUseCase } from '../application/use-cases/get-settings.use-case';
import { GetSettingUseCase } from '../application/use-cases/get-setting.use-case';
import { UpdateSettingUseCase } from '../application/use-cases/update-setting.use-case';
import { SettingQueryDto } from '../dto/setting-query.dto';
import { UpdateSettingDto } from '../dto/update-setting.dto';

@Injectable()
export class SettingsService {
    constructor(
        private readonly getSettingsUseCase: GetSettingsUseCase,
        private readonly getSettingUseCase: GetSettingUseCase,
        private readonly updateSettingUseCase: UpdateSettingUseCase,
    ) { }

    async updateSetting(companyId: string, settingId: string, dto: UpdateSettingDto) {
        return this.updateSettingUseCase.execute(settingId, dto, companyId);
    }

    async findAll(companyId: string, query?: SettingQueryDto) {
        return this.getSettingsUseCase.execute(query || {} as SettingQueryDto, companyId);
    }

    async findById(companyId: string, settingId: string) {
        return this.getSettingUseCase.execute(settingId, companyId);
    }
}

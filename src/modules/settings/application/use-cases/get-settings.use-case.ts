import { Injectable, Inject } from '@nestjs/common';
import type { ISettingRepository } from '../../domain/repositories/setting.repository.interface';
import { SettingQueryDto } from '../../dto/setting-query.dto';

@Injectable()
export class GetSettingsUseCase {
    constructor(
        @Inject('ISettingRepository')
        private readonly settingRepository: ISettingRepository,
    ) { }

    async execute(query: SettingQueryDto, companyId: string) {
        return await this.settingRepository.findAllPaginated(query, companyId);
    }
}

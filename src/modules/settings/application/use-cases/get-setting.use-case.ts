import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Setting } from '../../domain/entities/setting.entity';
import type { ISettingRepository } from '../../domain/repositories/setting.repository.interface';

@Injectable()
export class GetSettingUseCase {
    constructor(
        @Inject('ISettingRepository')
        private readonly settingRepository: ISettingRepository,
    ) { }

    async execute(id: string, companyId: string): Promise<Setting> {
        const setting = await this.settingRepository.findByIdAndTenant(id, companyId);

        if (!setting) {
            throw new NotFoundException('Setting not found');
        }

        return setting;
    }

    async executeByKey(key: string, companyId: string): Promise<Setting> {
        const setting = await this.settingRepository.findByKey(key, companyId);

        if (!setting) {
            throw new NotFoundException(`Setting with key '${key}' not found`);
        }

        return setting;
    }
}

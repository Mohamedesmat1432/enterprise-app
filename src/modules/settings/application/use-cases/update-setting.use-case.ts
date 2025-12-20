import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { Setting } from '../../domain/entities/setting.entity';
import type { ISettingRepository } from '../../domain/repositories/setting.repository.interface';
import { UpdateSettingDto } from '../../dto/update-setting.dto';
import { handleDatabaseError } from '@common/utils/database-error.handler';

@Injectable()
export class UpdateSettingUseCase {
    constructor(
        @Inject('ISettingRepository')
        private readonly settingRepository: ISettingRepository,
    ) { }

    async execute(id: string, dto: UpdateSettingDto, companyId: string): Promise<Setting> {
        try {
            const setting = await this.settingRepository.findByIdAndTenant(id, companyId);

            if (!setting) {
                throw new NotFoundException('Setting not found');
            }

            // Use domain method to set typed value
            if (dto.value !== undefined) {
                setting.setTypedValue(dto.value);
            }

            if (dto.description !== undefined) {
                setting.description = dto.description;
            }

            return await this.settingRepository.save(setting);
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            handleDatabaseError(error, 'Failed to update setting');
            throw error;
        }
    }
}

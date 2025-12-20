import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from './domain/entities/setting.entity';
import { SettingsService } from './services/settings.service';
import { SettingsController } from './controllers/settings.controller';
import { TypeOrmSettingRepository } from './infrastructure/persistence/typeorm-setting.repository';
import { GetSettingsUseCase } from './application/use-cases/get-settings.use-case';
import { GetSettingUseCase } from './application/use-cases/get-setting.use-case';
import { UpdateSettingUseCase } from './application/use-cases/update-setting.use-case';

@Module({
    imports: [TypeOrmModule.forFeature([Setting])],
    providers: [
        SettingsService,
        {
            provide: 'ISettingRepository',
            useClass: TypeOrmSettingRepository,
        },
        GetSettingsUseCase,
        GetSettingUseCase,
        UpdateSettingUseCase,
    ],
    controllers: [SettingsController],
    exports: [
        SettingsService,
        'ISettingRepository',
        GetSettingsUseCase,
        GetSettingUseCase,
        UpdateSettingUseCase,
    ],
})
export class SettingsModule { }

import { Test, TestingModule } from '@nestjs/testing';
import { SettingsService } from './settings.service';
import { GetSettingsUseCase } from '../application/use-cases/get-settings.use-case';
import { GetSettingUseCase } from '../application/use-cases/get-setting.use-case';
import { UpdateSettingUseCase } from '../application/use-cases/update-setting.use-case';
import { SettingQueryDto } from '../dto/setting-query.dto';
import { UpdateSettingDto } from '../dto/update-setting.dto';

describe('SettingsService', () => {
    let service: SettingsService;
    let getSettingsUseCase: jest.Mocked<GetSettingsUseCase>;
    let getSettingUseCase: jest.Mocked<GetSettingUseCase>;
    let updateSettingUseCase: jest.Mocked<UpdateSettingUseCase>;

    const mockSetting = { id: 'setting-1', key: 'theme', value: 'dark', companyId: 'company-1' };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SettingsService,
                {
                    provide: GetSettingsUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: GetSettingUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: UpdateSettingUseCase,
                    useValue: { execute: jest.fn() },
                },
            ],
        }).compile();

        service = module.get<SettingsService>(SettingsService);
        getSettingsUseCase = module.get(GetSettingsUseCase);
        getSettingUseCase = module.get(GetSettingUseCase);
        updateSettingUseCase = module.get(UpdateSettingUseCase);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('updateSetting', () => {
        it('should delegate to UpdateSettingUseCase', async () => {
            const dto: UpdateSettingDto = { value: 'light' } as UpdateSettingDto;
            updateSettingUseCase.execute.mockResolvedValue({ ...mockSetting, value: 'light' } as any);

            const result = await service.updateSetting('company-1', 'setting-1', dto);

            expect(updateSettingUseCase.execute).toHaveBeenCalledWith('setting-1', dto, 'company-1');
            expect(result.value).toBe('light');
        });
    });

    describe('findAll', () => {
        it('should delegate to GetSettingsUseCase with query', async () => {
            const query: SettingQueryDto = { category: 'general' } as SettingQueryDto;
            const settings = [mockSetting];
            getSettingsUseCase.execute.mockResolvedValue(settings as any);

            const result = await service.findAll('company-1', query);

            expect(getSettingsUseCase.execute).toHaveBeenCalledWith(query, 'company-1');
            expect(result).toEqual(settings);
        });

        it('should delegate to GetSettingsUseCase with empty query if not provided', async () => {
            const settings = [mockSetting];
            getSettingsUseCase.execute.mockResolvedValue(settings as any);

            const result = await service.findAll('company-1');

            expect(getSettingsUseCase.execute).toHaveBeenCalledWith({}, 'company-1');
            expect(result).toEqual(settings);
        });
    });

    describe('findById', () => {
        it('should delegate to GetSettingUseCase', async () => {
            getSettingUseCase.execute.mockResolvedValue(mockSetting as any);

            const result = await service.findById('company-1', 'setting-1');

            expect(getSettingUseCase.execute).toHaveBeenCalledWith('setting-1', 'company-1');
            expect(result).toEqual(mockSetting);
        });
    });
});

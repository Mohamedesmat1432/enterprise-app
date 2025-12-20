import { Test, TestingModule } from '@nestjs/testing';
import { SettingsController } from './settings.controller';
import { GetSettingsUseCase } from '../application/use-cases/get-settings.use-case';
import { GetSettingUseCase } from '../application/use-cases/get-setting.use-case';
import { UpdateSettingUseCase } from '../application/use-cases/update-setting.use-case';

describe('SettingsController', () => {
    let controller: SettingsController;
    let getSettingsUseCase: jest.Mocked<GetSettingsUseCase>;
    let getSettingUseCase: jest.Mocked<GetSettingUseCase>;
    let updateSettingUseCase: jest.Mocked<UpdateSettingUseCase>;

    const mockRequest = { user: { companyId: 'company-1' } };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SettingsController],
            providers: [
                { provide: GetSettingsUseCase, useValue: { execute: jest.fn() } },
                { provide: GetSettingUseCase, useValue: { execute: jest.fn() } },
                { provide: UpdateSettingUseCase, useValue: { execute: jest.fn() } },
            ],
        }).compile();

        controller = module.get<SettingsController>(SettingsController);
        getSettingsUseCase = module.get(GetSettingsUseCase);
        getSettingUseCase = module.get(GetSettingUseCase);
        updateSettingUseCase = module.get(UpdateSettingUseCase);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll', () => {
        it('should return all settings', async () => {
            const query = { page: 1, limit: 10 };
            const expected = { items: [{ id: '1', key: 'currency', value: 'USD' }], total: 1 };
            getSettingsUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.findAll(mockRequest, query);

            expect(getSettingsUseCase.execute).toHaveBeenCalledWith(query, 'company-1');
            expect(result).toEqual(expected);
        });
    });

    describe('findOne', () => {
        it('should return a setting by id', async () => {
            const expected = { id: '1', key: 'currency', value: 'USD' };
            getSettingUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.findOne(mockRequest, '1');

            expect(getSettingUseCase.execute).toHaveBeenCalledWith('1', 'company-1');
            expect(result).toEqual(expected);
        });
    });

    describe('update', () => {
        it('should update a setting', async () => {
            const dto = { value: 'EUR' };
            const expected = { id: '1', key: 'currency', value: 'EUR' };
            updateSettingUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.update(mockRequest, '1', dto as any);

            expect(updateSettingUseCase.execute).toHaveBeenCalledWith('1', dto, 'company-1');
            expect(result).toEqual(expected);
        });
    });
});

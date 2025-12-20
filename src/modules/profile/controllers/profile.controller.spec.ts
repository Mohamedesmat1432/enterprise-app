import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { GetProfileUseCase } from '../application/use-cases/get-profile.use-case';
import { UpdateProfileUseCase } from '../application/use-cases/update-profile.use-case';

describe('ProfileController', () => {
    let controller: ProfileController;
    let getProfileUseCase: jest.Mocked<GetProfileUseCase>;
    let updateProfileUseCase: jest.Mocked<UpdateProfileUseCase>;

    const mockRequest = { user: { userId: 'user-1', companyId: 'company-1' } };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProfileController],
            providers: [
                { provide: GetProfileUseCase, useValue: { execute: jest.fn() } },
                { provide: UpdateProfileUseCase, useValue: { execute: jest.fn() } },
            ],
        }).compile();

        controller = module.get<ProfileController>(ProfileController);
        getProfileUseCase = module.get(GetProfileUseCase);
        updateProfileUseCase = module.get(UpdateProfileUseCase);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getProfile', () => {
        it('should return current user profile', async () => {
            const expected = { id: 'user-1', name: 'John Doe', email: 'john@example.com' };
            getProfileUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.getProfile(mockRequest);

            expect(getProfileUseCase.execute).toHaveBeenCalledWith('user-1');
            expect(result).toEqual(expected);
        });
    });

    describe('updateProfile', () => {
        it('should update current user profile', async () => {
            const dto = { name: 'Jane Doe' };
            const expected = { id: 'user-1', name: 'Jane Doe', email: 'john@example.com' };
            updateProfileUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.updateProfile(mockRequest, dto);

            expect(updateProfileUseCase.execute).toHaveBeenCalledWith('user-1', dto);
            expect(result).toEqual(expected);
        });
    });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { GetProfileUseCase } from '../application/use-cases/get-profile.use-case';
import { UpdateProfileUseCase } from '../application/use-cases/update-profile.use-case';
import { UpdateUserDto } from '@modules/users/dto/update-user.dto';

describe('ProfileService', () => {
    let service: ProfileService;
    let getProfileUseCase: jest.Mocked<GetProfileUseCase>;
    let updateProfileUseCase: jest.Mocked<UpdateProfileUseCase>;

    const mockProfile = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'John Doe',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProfileService,
                {
                    provide: GetProfileUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: UpdateProfileUseCase,
                    useValue: { execute: jest.fn() },
                },
            ],
        }).compile();

        service = module.get<ProfileService>(ProfileService);
        getProfileUseCase = module.get(GetProfileUseCase);
        updateProfileUseCase = module.get(UpdateProfileUseCase);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getProfile', () => {
        it('should delegate to GetProfileUseCase', async () => {
            getProfileUseCase.execute.mockResolvedValue(mockProfile as any);

            const result = await service.getProfile('user-1');

            expect(getProfileUseCase.execute).toHaveBeenCalledWith('user-1');
            expect(result).toEqual(mockProfile);
        });
    });

    describe('updateProfile', () => {
        it('should delegate to UpdateProfileUseCase', async () => {
            const dto: UpdateUserDto = { name: 'Jane Doe' } as UpdateUserDto;
            updateProfileUseCase.execute.mockResolvedValue({ ...mockProfile, name: 'Jane Doe' } as any);

            const result = await service.updateProfile('user-1', dto);

            expect(updateProfileUseCase.execute).toHaveBeenCalledWith('user-1', dto);
            expect(result.name).toBe('Jane Doe');
        });
    });
});

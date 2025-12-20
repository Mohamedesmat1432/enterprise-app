import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from './permissions.service';
import { CreatePermissionUseCase } from '../application/use-cases/create-permission.use-case';
import { GetPermissionsUseCase } from '../application/use-cases/get-permissions.use-case';
import { GetPermissionUseCase } from '../application/use-cases/get-permission.use-case';
import { UpdatePermissionUseCase } from '../application/use-cases/update-permission.use-case';
import { DeletePermissionUseCase } from '../application/use-cases/delete-permission.use-case';
import { CreatePermissionDto } from '@modules/permissions/dto/create-permission.dto';
import { UpdatePermissionDto } from '@modules/permissions/dto/update-permission.dto';
import { PermissionQueryDto } from '@modules/permissions/dto/permission-query.dto';

describe('PermissionsService', () => {
    let service: PermissionsService;
    let createUseCase: jest.Mocked<CreatePermissionUseCase>;
    let getPermissionsUseCase: jest.Mocked<GetPermissionsUseCase>;
    let getPermissionUseCase: jest.Mocked<GetPermissionUseCase>;
    let updateUseCase: jest.Mocked<UpdatePermissionUseCase>;
    let deleteUseCase: jest.Mocked<DeletePermissionUseCase>;

    const mockPermission = { id: 'perm-1', slug: 'users.read', name: 'Read Users' };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PermissionsService,
                {
                    provide: CreatePermissionUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: GetPermissionsUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: GetPermissionUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: UpdatePermissionUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: DeletePermissionUseCase,
                    useValue: { execute: jest.fn() },
                },
            ],
        }).compile();

        service = module.get<PermissionsService>(PermissionsService);
        createUseCase = module.get(CreatePermissionUseCase);
        getPermissionsUseCase = module.get(GetPermissionsUseCase);
        getPermissionUseCase = module.get(GetPermissionUseCase);
        updateUseCase = module.get(UpdatePermissionUseCase);
        deleteUseCase = module.get(DeletePermissionUseCase);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should delegate to CreatePermissionUseCase', async () => {
            const dto: CreatePermissionDto = { slug: 'users.read', name: 'Read Users' } as CreatePermissionDto;
            createUseCase.execute.mockResolvedValue(mockPermission as any);

            const result = await service.create(dto);

            expect(createUseCase.execute).toHaveBeenCalledWith(dto);
            expect(result).toEqual(mockPermission);
        });
    });

    describe('findAll', () => {
        it('should delegate to GetPermissionsUseCase', async () => {
            const query: PermissionQueryDto = { page: 1, limit: 10 };
            const permissions = [mockPermission];
            getPermissionsUseCase.execute.mockResolvedValue(permissions as any);

            const result = await service.findAll(query);

            expect(getPermissionsUseCase.execute).toHaveBeenCalledWith(query);
            expect(result).toEqual(permissions);
        });
    });

    describe('findOne', () => {
        it('should delegate to GetPermissionUseCase', async () => {
            getPermissionUseCase.execute.mockResolvedValue(mockPermission as any);

            const result = await service.findOne('perm-1');

            expect(getPermissionUseCase.execute).toHaveBeenCalledWith('perm-1');
            expect(result).toEqual(mockPermission);
        });
    });

    describe('update', () => {
        it('should delegate to UpdatePermissionUseCase', async () => {
            const dto: UpdatePermissionDto = { description: 'Updated Permission' } as UpdatePermissionDto;
            updateUseCase.execute.mockResolvedValue({ ...mockPermission, ...dto } as any);

            const result = await service.update('perm-1', dto);

            expect(updateUseCase.execute).toHaveBeenCalledWith('perm-1', dto);
            expect(result.description).toBe('Updated Permission');
        });
    });

    describe('remove', () => {
        it('should delegate to DeletePermissionUseCase and return success message', async () => {
            deleteUseCase.execute.mockResolvedValue(undefined);

            const result = await service.remove('perm-1');

            expect(deleteUseCase.execute).toHaveBeenCalledWith('perm-1');
            expect(result).toEqual({ message: 'Permission deleted successfully' });
        });
    });
});

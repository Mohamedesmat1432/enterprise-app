import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsController } from './permissions.controller';
import { CreatePermissionUseCase } from '../application/use-cases/create-permission.use-case';
import { GetPermissionsUseCase } from '../application/use-cases/get-permissions.use-case';
import { GetPermissionUseCase } from '../application/use-cases/get-permission.use-case';
import { UpdatePermissionUseCase } from '../application/use-cases/update-permission.use-case';
import { DeletePermissionUseCase } from '../application/use-cases/delete-permission.use-case';

describe('PermissionsController', () => {
    let controller: PermissionsController;
    let createPermissionUseCase: jest.Mocked<CreatePermissionUseCase>;
    let getPermissionsUseCase: jest.Mocked<GetPermissionsUseCase>;
    let getPermissionUseCase: jest.Mocked<GetPermissionUseCase>;
    let updatePermissionUseCase: jest.Mocked<UpdatePermissionUseCase>;
    let deletePermissionUseCase: jest.Mocked<DeletePermissionUseCase>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PermissionsController],
            providers: [
                { provide: CreatePermissionUseCase, useValue: { execute: jest.fn() } },
                { provide: GetPermissionsUseCase, useValue: { execute: jest.fn() } },
                { provide: GetPermissionUseCase, useValue: { execute: jest.fn() } },
                { provide: UpdatePermissionUseCase, useValue: { execute: jest.fn() } },
                { provide: DeletePermissionUseCase, useValue: { execute: jest.fn() } },
            ],
        }).compile();

        controller = module.get<PermissionsController>(PermissionsController);
        createPermissionUseCase = module.get(CreatePermissionUseCase);
        getPermissionsUseCase = module.get(GetPermissionsUseCase);
        getPermissionUseCase = module.get(GetPermissionUseCase);
        updatePermissionUseCase = module.get(UpdatePermissionUseCase);
        deletePermissionUseCase = module.get(DeletePermissionUseCase);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a permission', async () => {
            const dto = { name: 'Read Users', slug: 'read.users', module: 'users' };
            const expected = { id: '1', ...dto };
            createPermissionUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.create(dto);

            expect(createPermissionUseCase.execute).toHaveBeenCalledWith(dto);
            expect(result).toEqual(expected);
        });
    });

    describe('findAll', () => {
        it('should return all permissions', async () => {
            const expected = { items: [{ id: '1', slug: 'read.users' }], total: 1 };
            getPermissionsUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.findAll({});

            expect(getPermissionsUseCase.execute).toHaveBeenCalledWith({});
            expect(result).toEqual(expected);
        });
    });

    describe('findOne', () => {
        it('should return a permission by id', async () => {
            const expected = { id: '1', slug: 'read.users', name: 'Read Users' };
            getPermissionUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.findOne('1');

            expect(getPermissionUseCase.execute).toHaveBeenCalledWith('1');
            expect(result).toEqual(expected);
        });
    });

    describe('update', () => {
        it('should update a permission', async () => {
            const dto = { description: 'Read All Users' };
            const expected = { id: '1', slug: 'read.users', ...dto };
            updatePermissionUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.update('1', dto);

            expect(updatePermissionUseCase.execute).toHaveBeenCalledWith('1', dto);
            expect(result).toEqual(expected);
        });
    });

    describe('remove', () => {
        it('should delete a permission', async () => {
            deletePermissionUseCase.execute.mockResolvedValue({ message: 'Permission deleted' } as any);

            await controller.remove('1');

            expect(deletePermissionUseCase.execute).toHaveBeenCalledWith('1');
        });
    });
});

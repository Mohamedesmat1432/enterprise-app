import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { CreateRoleUseCase } from '../application/use-cases/create-role.use-case';
import { GetRolesUseCase } from '../application/use-cases/get-roles.use-case';
import { GetRoleUseCase } from '../application/use-cases/get-role.use-case';
import { UpdateRoleUseCase } from '../application/use-cases/update-role.use-case';
import { DeleteRoleUseCase } from '../application/use-cases/delete-role.use-case';
import { AssignPermissionUseCase } from '../application/use-cases/assign-permission.use-case';

describe('RolesController', () => {
    let controller: RolesController;
    let createRoleUseCase: jest.Mocked<CreateRoleUseCase>;
    let getRolesUseCase: jest.Mocked<GetRolesUseCase>;
    let getRoleUseCase: jest.Mocked<GetRoleUseCase>;
    let updateRoleUseCase: jest.Mocked<UpdateRoleUseCase>;
    let deleteRoleUseCase: jest.Mocked<DeleteRoleUseCase>;
    let assignPermissionUseCase: jest.Mocked<AssignPermissionUseCase>;

    const mockRequest = { user: { companyId: 'company-1' } };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RolesController],
            providers: [
                { provide: CreateRoleUseCase, useValue: { execute: jest.fn() } },
                { provide: GetRolesUseCase, useValue: { execute: jest.fn() } },
                { provide: GetRoleUseCase, useValue: { execute: jest.fn() } },
                { provide: UpdateRoleUseCase, useValue: { execute: jest.fn() } },
                { provide: DeleteRoleUseCase, useValue: { execute: jest.fn() } },
                { provide: AssignPermissionUseCase, useValue: { execute: jest.fn() } },
            ],
        }).compile();

        controller = module.get<RolesController>(RolesController);
        createRoleUseCase = module.get(CreateRoleUseCase);
        getRolesUseCase = module.get(GetRolesUseCase);
        getRoleUseCase = module.get(GetRoleUseCase);
        updateRoleUseCase = module.get(UpdateRoleUseCase);
        deleteRoleUseCase = module.get(DeleteRoleUseCase);
        assignPermissionUseCase = module.get(AssignPermissionUseCase);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a role', async () => {
            const dto = { name: 'Manager', permissions: ['read.users', 'update.users'] };
            const expected = { id: '1', ...dto };
            createRoleUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.create(mockRequest, dto);

            expect(createRoleUseCase.execute).toHaveBeenCalledWith(dto, 'company-1');
            expect(result).toEqual(expected);
        });
    });

    describe('findAll', () => {
        it('should return paginated roles', async () => {
            const query = { page: 1, limit: 10 };
            const expected = { items: [{ id: '1', name: 'Admin' }], total: 1 };
            getRolesUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.findAll(mockRequest, query);

            expect(getRolesUseCase.execute).toHaveBeenCalledWith(query, 'company-1');
            expect(result).toEqual(expected);
        });
    });

    describe('findOne', () => {
        it('should return a role by id', async () => {
            const expected = { id: '1', name: 'Admin', permissions: [] };
            getRoleUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.findOne(mockRequest, '1');

            expect(getRoleUseCase.execute).toHaveBeenCalledWith('1', 'company-1');
            expect(result).toEqual(expected);
        });
    });

    describe('update', () => {
        it('should update a role', async () => {
            const dto = { name: 'Senior Manager' };
            const expected = { id: '1', ...dto };
            updateRoleUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.update(mockRequest, '1', dto);

            expect(updateRoleUseCase.execute).toHaveBeenCalledWith('1', dto, 'company-1');
            expect(result).toEqual(expected);
        });
    });

    describe('remove', () => {
        it('should delete a role', async () => {
            deleteRoleUseCase.execute.mockResolvedValue({ message: 'Role deleted' } as any);

            const result = await controller.remove(mockRequest, '1');

            expect(deleteRoleUseCase.execute).toHaveBeenCalledWith('1', 'company-1');
        });
    });

    describe('assignPermission', () => {
        it('should assign permission to role', async () => {
            const expected = { id: '1', name: 'Admin', permissions: [{ slug: 'read.users' }] };
            assignPermissionUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.assignPermission(mockRequest, '1', 'read.users');

            expect(assignPermissionUseCase.execute).toHaveBeenCalledWith('1', 'read.users', 'company-1');
            expect(result).toEqual(expected);
        });
    });
});

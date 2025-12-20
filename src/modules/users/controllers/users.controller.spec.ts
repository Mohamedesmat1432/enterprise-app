import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { GetUsersUseCase } from '../application/use-cases/get-users.use-case';
import { GetUserUseCase } from '../application/use-cases/get-user.use-case';
import { UpdateUserUseCase } from '../application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../application/use-cases/delete-user.use-case';
import { ChangePasswordUseCase } from '../application/use-cases/change-password.use-case';
import { AssignRoleUseCase } from '../application/use-cases/assign-role.use-case';

describe('UsersController', () => {
    let controller: UsersController;
    let createUserUseCase: jest.Mocked<CreateUserUseCase>;
    let getUsersUseCase: jest.Mocked<GetUsersUseCase>;
    let getUserUseCase: jest.Mocked<GetUserUseCase>;
    let updateUserUseCase: jest.Mocked<UpdateUserUseCase>;
    let deleteUserUseCase: jest.Mocked<DeleteUserUseCase>;
    let changePasswordUseCase: jest.Mocked<ChangePasswordUseCase>;
    let assignRoleUseCase: jest.Mocked<AssignRoleUseCase>;

    const mockRequest = { user: { userId: 'user-1', companyId: 'company-1' } };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                { provide: CreateUserUseCase, useValue: { execute: jest.fn() } },
                { provide: GetUsersUseCase, useValue: { execute: jest.fn() } },
                { provide: GetUserUseCase, useValue: { execute: jest.fn() } },
                { provide: UpdateUserUseCase, useValue: { execute: jest.fn() } },
                { provide: DeleteUserUseCase, useValue: { execute: jest.fn() } },
                { provide: ChangePasswordUseCase, useValue: { execute: jest.fn() } },
                { provide: AssignRoleUseCase, useValue: { execute: jest.fn() } },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
        createUserUseCase = module.get(CreateUserUseCase);
        getUsersUseCase = module.get(GetUsersUseCase);
        getUserUseCase = module.get(GetUserUseCase);
        updateUserUseCase = module.get(UpdateUserUseCase);
        deleteUserUseCase = module.get(DeleteUserUseCase);
        changePasswordUseCase = module.get(ChangePasswordUseCase);
        assignRoleUseCase = module.get(AssignRoleUseCase);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a user', async () => {
            const dto = { name: 'John Doe', email: 'john@example.com', password: 'Password123!' };
            const expected = { id: '1', ...dto };
            createUserUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.create(dto, mockRequest);

            expect(createUserUseCase.execute).toHaveBeenCalledWith(dto, 'company-1');
            expect(result).toEqual(expected);
        });
    });

    describe('findAll', () => {
        it('should return paginated users', async () => {
            const query = { page: 1, limit: 10 };
            const expected = { items: [{ id: '1', name: 'User' }], total: 1 };
            getUsersUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.findAll(mockRequest, query);

            expect(getUsersUseCase.execute).toHaveBeenCalledWith(query, 'company-1');
            expect(result).toEqual(expected);
        });
    });

    describe('findOne', () => {
        it('should return a user by id', async () => {
            const expected = { id: '1', name: 'John Doe' };
            getUserUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.findOne(mockRequest, '1');

            expect(getUserUseCase.execute).toHaveBeenCalledWith('1', 'company-1');
            expect(result).toEqual(expected);
        });
    });

    describe('update', () => {
        it('should update a user', async () => {
            const dto = { name: 'Jane Doe' };
            const expected = { id: '1', ...dto };
            updateUserUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.update(mockRequest, '1', dto);

            expect(updateUserUseCase.execute).toHaveBeenCalledWith('1', dto, 'company-1');
            expect(result).toEqual(expected);
        });
    });

    describe('remove', () => {
        it('should delete a user', async () => {
            deleteUserUseCase.execute.mockResolvedValue({ message: 'User deleted' } as any);

            const result = await controller.remove(mockRequest, '1');

            expect(deleteUserUseCase.execute).toHaveBeenCalledWith('1', 'company-1');
        });
    });

    describe('changePassword', () => {
        it('should change user password', async () => {
            const dto = { currentPassword: 'old', newPassword: 'New123!' };
            const expected = { message: 'Password changed successfully' };
            changePasswordUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.changePassword(mockRequest, dto);

            expect(changePasswordUseCase.execute).toHaveBeenCalledWith('user-1', dto);
            expect(result).toEqual(expected);
        });
    });

    describe('assignRole', () => {
        it('should assign role to user', async () => {
            const dto = { roleName: 'Admin' };
            const expected = { id: '1', roles: [{ name: 'Admin' }] };
            assignRoleUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.assignRole(mockRequest, '1', dto);

            expect(assignRoleUseCase.execute).toHaveBeenCalledWith('1', 'Admin', 'company-1');
            expect(result).toEqual(expected);
        });
    });
});

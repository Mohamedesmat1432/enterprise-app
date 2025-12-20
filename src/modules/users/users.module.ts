import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entities/user.entity';
import { Role } from '@modules/roles/domain/entities/role.entity';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm-user.repository';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { GetUsersUseCase } from './application/use-cases/get-users.use-case';
import { GetUserUseCase } from './application/use-cases/get-user.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { ChangePasswordUseCase } from './application/use-cases/change-password.use-case';
import { AssignRoleUseCase } from './application/use-cases/assign-role.use-case';
import { CompaniesModule } from '@modules/companies/companies.module';
import { RolesModule } from '@modules/roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    CompaniesModule,
    RolesModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    CreateUserUseCase,
    GetUsersUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    ChangePasswordUseCase,
    AssignRoleUseCase,
    {
      provide: 'IUserRepository',
      useClass: TypeOrmUserRepository,
    },
  ],
  exports: [
    UsersService,
    'IUserRepository',
    CreateUserUseCase,
    GetUsersUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    ChangePasswordUseCase,
    AssignRoleUseCase,
  ],
})
export class UsersModule { }

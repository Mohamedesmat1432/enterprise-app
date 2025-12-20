import { Module } from '@nestjs/common';
import { RolesService } from './services/roles.service';
import { RolesController } from './controllers/roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './domain/entities/role.entity';
import { Permission } from '@modules/permissions/domain/entities/permission.entity';
import { TypeOrmRoleRepository } from './infrastructure/persistence/typeorm-role.repository';
import { CreateRoleUseCase } from './application/use-cases/create-role.use-case';
import { GetRolesUseCase } from './application/use-cases/get-roles.use-case';
import { GetRoleUseCase } from './application/use-cases/get-role.use-case';
import { UpdateRoleUseCase } from './application/use-cases/update-role.use-case';
import { DeleteRoleUseCase } from './application/use-cases/delete-role.use-case';
import { AssignPermissionUseCase } from './application/use-cases/assign-permission.use-case';
import { PermissionsModule } from '@modules/permissions/permissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Permission]),
    PermissionsModule,
  ],
  controllers: [RolesController],
  providers: [
    RolesService,
    {
      provide: 'IRoleRepository',
      useClass: TypeOrmRoleRepository,
    },
    CreateRoleUseCase,
    GetRolesUseCase,
    GetRoleUseCase,
    UpdateRoleUseCase,
    DeleteRoleUseCase,
    AssignPermissionUseCase,
  ],
  exports: [
    RolesService,
    'IRoleRepository',
    CreateRoleUseCase,
    GetRolesUseCase,
    GetRoleUseCase,
    UpdateRoleUseCase,
    DeleteRoleUseCase,
    AssignPermissionUseCase,
  ],
})
export class RolesModule { }

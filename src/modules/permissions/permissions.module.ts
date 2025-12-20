import { Module } from '@nestjs/common';
import { PermissionsService } from './services/permissions.service';
import { PermissionsController } from './controllers/permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './domain/entities/permission.entity';
import { TypeOrmPermissionRepository } from './infrastructure/persistence/typeorm-permission.repository';
import { CreatePermissionUseCase } from './application/use-cases/create-permission.use-case';
import { GetPermissionsUseCase } from './application/use-cases/get-permissions.use-case';
import { GetPermissionUseCase } from './application/use-cases/get-permission.use-case';
import { UpdatePermissionUseCase } from './application/use-cases/update-permission.use-case';
import { DeletePermissionUseCase } from './application/use-cases/delete-permission.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  controllers: [PermissionsController],
  providers: [
    PermissionsService,
    {
      provide: 'IPermissionRepository',
      useClass: TypeOrmPermissionRepository,
    },
    CreatePermissionUseCase,
    GetPermissionsUseCase,
    GetPermissionUseCase,
    UpdatePermissionUseCase,
    DeletePermissionUseCase,
  ],
  exports: [
    PermissionsService,
    'IPermissionRepository',
    CreatePermissionUseCase,
    GetPermissionsUseCase,
    GetPermissionUseCase,
    UpdatePermissionUseCase,
    DeletePermissionUseCase,
  ],
})
export class PermissionsModule { }

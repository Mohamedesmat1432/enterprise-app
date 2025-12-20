
import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from '@modules/permissions/dto/create-permission.dto';
import { UpdatePermissionDto } from '@modules/permissions/dto/update-permission.dto';
import { PermissionQueryDto } from '@modules/permissions/dto/permission-query.dto';
import { CreatePermissionUseCase } from '../application/use-cases/create-permission.use-case';
import { GetPermissionsUseCase } from '../application/use-cases/get-permissions.use-case';
import { GetPermissionUseCase } from '../application/use-cases/get-permission.use-case';
import { UpdatePermissionUseCase } from '../application/use-cases/update-permission.use-case';
import { DeletePermissionUseCase } from '../application/use-cases/delete-permission.use-case';

@Injectable()
export class PermissionsService {
  constructor(
    private readonly createUseCase: CreatePermissionUseCase,
    private readonly getPermissionsUseCase: GetPermissionsUseCase,
    private readonly getPermissionUseCase: GetPermissionUseCase,
    private readonly updateUseCase: UpdatePermissionUseCase,
    private readonly deleteUseCase: DeletePermissionUseCase,
  ) { }

  async create(dto: CreatePermissionDto) {
    return this.createUseCase.execute(dto);
  }

  async findAll(query: PermissionQueryDto) {
    return this.getPermissionsUseCase.execute(query);
  }

  async findOne(id: string) {
    return this.getPermissionUseCase.execute(id);
  }

  async update(id: string, dto: UpdatePermissionDto) {
    return this.updateUseCase.execute(id, dto);
  }

  async remove(id: string) {
    await this.deleteUseCase.execute(id);
    return { message: 'Permission deleted successfully' };
  }
}

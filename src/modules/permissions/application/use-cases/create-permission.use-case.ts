import { Injectable, Inject } from '@nestjs/common';
import type { IPermissionRepository } from '../../domain/repositories/permission.repository.interface';
import type { CreatePermissionDto } from '../../dto/create-permission.dto';
import { handleDatabaseError } from '@common/utils/database-error.handler';
import type { Permission } from '@modules/permissions/domain/entities/permission.entity';

@Injectable()
export class CreatePermissionUseCase {
    constructor(
        @Inject('IPermissionRepository')
        private readonly permissionRepository: IPermissionRepository,
    ) { }

    async execute(dto: CreatePermissionDto): Promise<Permission> {
        try {
            return await this.permissionRepository.create(dto);
        } catch (error) {
            handleDatabaseError(error, 'Permission slug already exists');
            throw error;
        }
    }
}

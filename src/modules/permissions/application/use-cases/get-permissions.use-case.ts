import { Injectable, Inject } from '@nestjs/common';
import type { IPermissionRepository } from '../../domain/repositories/permission.repository.interface';
import type { PermissionQueryDto } from '../../dto/permission-query.dto';

@Injectable()
export class GetPermissionsUseCase {
    constructor(
        @Inject('IPermissionRepository')
        private readonly permissionRepository: IPermissionRepository,
    ) { }

    async execute(query: PermissionQueryDto) {
        return await this.permissionRepository.findAllPaginated(query);
    }
}

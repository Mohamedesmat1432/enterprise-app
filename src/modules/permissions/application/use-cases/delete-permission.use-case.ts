import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import type { IPermissionRepository } from '../../domain/repositories/permission.repository.interface';

@Injectable()
export class DeletePermissionUseCase {
    constructor(
        @Inject('IPermissionRepository')
        private readonly permissionRepository: IPermissionRepository,
    ) { }

    async execute(id: string): Promise<void> {
        const permission = await this.permissionRepository.findById(id, ['roles']);
        if (!permission) {
            throw new NotFoundException('Permission not found');
        }

        if (permission.roles?.length) {
            throw new BadRequestException(
                `Cannot delete permission assigned to ${permission.roles.length} role(s)`,
            );
        }

        await this.permissionRepository.delete(id);
    }
}

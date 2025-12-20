import { Injectable, Inject } from '@nestjs/common';
import type { IRoleRepository } from '../../domain/repositories/role.repository.interface';
import type { RoleQueryDto } from '../../dto/role-query.dto';

@Injectable()
export class GetRolesUseCase {
    constructor(
        @Inject('IRoleRepository')
        private readonly roleRepository: IRoleRepository,
    ) { }

    async execute(query: RoleQueryDto, companyId: string) {
        return await this.roleRepository.findAllPaginated(query, companyId);
    }
}

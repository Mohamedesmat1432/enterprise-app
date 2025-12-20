import { Role } from '../entities/role.entity';
import { ITenantRepository } from '@app/../core/domain/repositories/base-repository.interface';
import { RoleQueryDto } from '../../dto/role-query.dto';

export interface IRoleRepository extends ITenantRepository<Role> {
    findByName(name: string, companyId?: string): Promise<Role | null>;
    findManyByNames(names: string[], companyId?: string): Promise<Role[]>;
    findAllPaginated(query: RoleQueryDto, companyId: string): Promise<any>;
}

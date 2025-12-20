import { Permission } from '../entities/permission.entity';
import { IRepository } from '@app/../core/domain/repositories/base-repository.interface';
import { PermissionQueryDto } from '../../dto/permission-query.dto';

export interface IPermissionRepository extends IRepository<Permission> {
    findBySlugs(slugs: string[]): Promise<Permission[]>;
    findAllPaginated(query: PermissionQueryDto): Promise<any>;
}

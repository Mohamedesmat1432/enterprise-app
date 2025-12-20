import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from '../../domain/entities/role.entity';
import { IRoleRepository } from '../../domain/repositories/role.repository.interface';
import { BaseTenantTypeOrmRepository } from '@app/../core/infrastructure/persistence/base-typeorm.repository';
import { RoleQueryDto } from '../../dto/role-query.dto';
import { createPaginatedResponse } from '@common/dto/pagination.dto';

@Injectable()
export class TypeOrmRoleRepository
    extends BaseTenantTypeOrmRepository<Role>
    implements IRoleRepository {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepo: Repository<Role>,
    ) {
        super(roleRepo);
    }

    async findByName(name: string, companyId?: string): Promise<Role | null> {
        const where: any = { name };
        if (companyId) where.companyId = companyId;
        return await this.roleRepo.findOne({ where });
    }

    async findManyByNames(names: string[], companyId?: string): Promise<Role[]> {
        const where: any = { name: In(names) };
        if (companyId) where.companyId = companyId;
        return await this.roleRepo.find({ where });
    }

    async findAllPaginated(query: RoleQueryDto, companyId: string): Promise<any> {
        const {
            page = 1,
            limit = 10,
            search,
            sortBy = 'name',
            sortOrder = 'ASC',
        } = query;

        const qb = this.roleRepo.createQueryBuilder('role');
        qb.leftJoinAndSelect('role.permissions', 'permissions')
            .where('role.company_id = :companyId', { companyId });

        if (search) {
            qb.andWhere('role.name ILIKE :search', {
                search: `%${search}%`,
            });
        }

        if (sortBy) {
            qb.orderBy(`role.${sortBy}`, sortOrder as any);
        }

        qb.skip((page - 1) * limit).take(limit);

        const [items, total] = await qb.getManyAndCount();

        return createPaginatedResponse(items, total, page, limit);
    }
}

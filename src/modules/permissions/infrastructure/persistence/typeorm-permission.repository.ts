import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Permission } from '../../domain/entities/permission.entity';
import { IPermissionRepository } from '../../domain/repositories/permission.repository.interface';
import { BaseTypeOrmRepository } from '@app/../core/infrastructure/persistence/base-typeorm.repository';
import { PermissionQueryDto } from '../../dto/permission-query.dto';
import { createPaginatedResponse } from '@common/dto/pagination.dto';

@Injectable()
export class TypeOrmPermissionRepository
    extends BaseTypeOrmRepository<Permission>
    implements IPermissionRepository {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepo: Repository<Permission>,
    ) {
        super(permissionRepo);
    }

    async findBySlugs(slugs: string[]): Promise<Permission[]> {
        return await this.permissionRepo.find({ where: { slug: In(slugs) } });
    }

    async findAllPaginated(query: PermissionQueryDto): Promise<any> {
        const {
            page = 1,
            limit = 10,
            search,
            sortBy = 'slug',
            sortOrder = 'ASC',
        } = query;

        const qb = this.permissionRepo.createQueryBuilder('permission');

        if (search) {
            qb.andWhere('(permission.slug ILIKE :search OR permission.description ILIKE :search)', {
                search: `%${search}%`,
            });
        }

        if (sortBy) {
            qb.orderBy(`permission.${sortBy}`, sortOrder as any);
        }

        qb.skip((page - 1) * limit).take(limit);

        const [items, total] = await qb.getManyAndCount();

        return createPaginatedResponse(items, total, page, limit);
    }
}

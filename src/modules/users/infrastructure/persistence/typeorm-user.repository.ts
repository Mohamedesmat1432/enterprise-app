import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { BaseTenantTypeOrmRepository } from '@app/../core/infrastructure/persistence/base-typeorm.repository';
import { UserQueryDto } from '../../dto/user-query.dto';
import { createPaginatedResponse } from '@common/dto/pagination.dto';

@Injectable()
export class TypeOrmUserRepository
    extends BaseTenantTypeOrmRepository<User>
    implements IUserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {
        super(userRepo);
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.userRepo.findOne({ where: { email } });
    }

    async findByEmailWithAuth(email: string): Promise<User | null> {
        return await this.userRepo
            .createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.email = :email', { email })
            .leftJoinAndSelect(
                'user.roles',
                'roles',
                'roles.company_id = user.active_company_id'
            )
            .leftJoinAndSelect('roles.permissions', 'permissions')
            .getOne();
    }

    async findAllPaginated(query: UserQueryDto, companyId?: string): Promise<any> {
        const {
            page = 1,
            limit = 10,
            search,
            role,
            status,
            sortBy = 'id',
            sortOrder = 'ASC',
        } = query;

        const qb = this.userRepo.createQueryBuilder('user');
        qb.leftJoinAndSelect('user.roles', 'roles');

        if (companyId) {
            qb.innerJoin('user.companies', 'company', 'company.id = :companyId', { companyId });
        }

        if (search) {
            qb.andWhere('(user.name ILIKE :search OR user.email ILIKE :search)', {
                search: `%${search}%`,
            });
        }

        if (role) {
            qb.andWhere('roles.name = :role', { role });
        }

        if (status) {
            qb.andWhere('user.status = :status', { status });
        }

        if (sortBy) {
            qb.orderBy(`user.${sortBy}`, sortOrder as any);
        }

        qb.skip((page - 1) * limit).take(limit);

        const [items, total] = await qb.getManyAndCount();

        return createPaginatedResponse(items, total, page, limit);
    }
}

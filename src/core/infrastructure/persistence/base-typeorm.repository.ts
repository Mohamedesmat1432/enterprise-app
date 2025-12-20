import {
    Repository,
    FindOptionsWhere,
    DeepPartial,
    FindOneOptions,
    FindManyOptions,
} from 'typeorm';
import { IRepository, ITenantRepository } from '../../domain/repositories/base-repository.interface';
import { BaseEntity, BaseTenantEntity } from '../../domain/entities/base.entity';
import { NotFoundException } from '@nestjs/common';

export abstract class BaseTypeOrmRepository<T extends BaseEntity> implements IRepository<T> {
    constructor(protected readonly repository: Repository<T>) { }

    async findAll(options?: FindManyOptions<T>): Promise<T[]> {
        return await this.repository.find(options);
    }

    async findById(id: string, relations?: string[]): Promise<T | null> {
        const options: FindOneOptions<any> = {
            where: { id },
            relations,
        };
        return await this.repository.findOne(options);
    }

    async findOne(options: FindOneOptions<T>): Promise<T | null> {
        return await this.repository.findOne(options);
    }

    async create(data: Partial<T>): Promise<T> {
        const entity = this.repository.create(data as any);
        return await this.repository.save(entity as any);
    }

    async update(id: string, data: Partial<T>): Promise<T> {
        await this.repository.update(id, data as any);
        return await this.findById(id) as T;
    }

    async save(entity: T): Promise<T> {
        return await this.repository.save(entity);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async softDelete(id: string): Promise<void> {
        await this.repository.softDelete(id);
    }
}

export abstract class BaseTenantTypeOrmRepository<T extends BaseTenantEntity>
    extends BaseTypeOrmRepository<T>
    implements ITenantRepository<T> {
    async findAllByTenant(tenantId: string, options?: FindManyOptions<T>): Promise<T[]> {
        const tenantOptions: FindManyOptions<any> = {
            ...options,
            where: { ...options?.where, companyId: tenantId },
        };
        return await this.repository.find(tenantOptions);
    }

    async findByIdAndTenant(id: string, tenantId: string, relations?: string[]): Promise<T | null> {
        const options: FindOneOptions<any> = {
            where: { id, companyId: tenantId },
            relations,
        };
        return await this.repository.findOne(options);
    }
}

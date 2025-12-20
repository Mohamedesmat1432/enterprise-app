export interface IRepository<T> {
    findAll(options?: any): Promise<T[]>;
    findById(id: string, relations?: string[]): Promise<T | null>;
    create(data: Partial<T>): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T>;
    save(entity: T): Promise<T>;
    delete(id: string): Promise<void>;
    softDelete(id: string): Promise<void>;
}

export interface ITenantRepository<T> extends IRepository<T> {
    findAllByTenant(tenantId: string, options?: any): Promise<T[]>;
    findByIdAndTenant(id: string, tenantId: string, relations?: string[]): Promise<T | null>;
}

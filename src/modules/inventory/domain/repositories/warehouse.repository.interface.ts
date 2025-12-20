
import { Warehouse } from '../entities/warehouse.entity';
import { IRepository } from '@core/domain/repositories/base-repository.interface';

export interface IWarehouseRepository extends IRepository<Warehouse> {
    findAllPaginated(companyId: string): Promise<Warehouse[]>;
}

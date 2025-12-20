
import { Injectable, Inject } from '@nestjs/common';
import type { IWarehouseRepository } from '../../domain/repositories/warehouse.repository.interface';
import { Warehouse } from '../../domain/entities/warehouse.entity';

@Injectable()
export class GetWarehousesUseCase {
    constructor(
        @Inject('IWarehouseRepository')
        private readonly warehouseRepo: IWarehouseRepository,
    ) { }

    async execute(companyId: string): Promise<Warehouse[]> {
        return await this.warehouseRepo.findAllPaginated(companyId);
    }
}

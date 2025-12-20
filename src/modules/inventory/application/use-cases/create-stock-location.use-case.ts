
import { Injectable, Inject } from '@nestjs/common';
import type { IStockLocationRepository } from '../../domain/repositories/stock-location.repository.interface';
import { StockLocation } from '../../domain/entities/stock-location.entity';
import { CreateStockLocationDto } from '../../dto/create-stock-location.dto';

@Injectable()
export class CreateStockLocationUseCase {
    constructor(
        @Inject('IStockLocationRepository')
        private readonly locationRepo: IStockLocationRepository,
    ) { }

    async execute(companyId: string, dto: CreateStockLocationDto, userId: string): Promise<StockLocation> {
        const location = new StockLocation();
        Object.assign(location, dto);
        location.companyId = companyId;
        location.createdBy = userId;
        return await this.locationRepo.create(location);
    }
}

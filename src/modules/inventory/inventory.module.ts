
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from './domain/entities/warehouse.entity';
import { StockLocation } from './domain/entities/stock-location.entity';
import { StockMove } from './domain/entities/stock-move.entity';
import { StockQuant } from './domain/entities/stock-quant.entity';
import { InventoryService } from './services/inventory.service';
import { InventoryController } from './controllers/inventory.controller';
import { TypeOrmWarehouseRepository } from './infrastructure/persistence/typeorm-warehouse.repository';
import { TypeOrmStockLocationRepository } from './infrastructure/persistence/typeorm-stock-location.repository';
import { TypeOrmStockMoveRepository } from './infrastructure/persistence/typeorm-stock-move.repository';
import { TypeOrmStockQuantRepository } from './infrastructure/persistence/typeorm-stock-quant.repository';
import { CreateWarehouseUseCase } from './application/use-cases/create-warehouse.use-case';
import { GetWarehousesUseCase } from './application/use-cases/get-warehouses.use-case';
import { CreateStockLocationUseCase } from './application/use-cases/create-stock-location.use-case';
import { GetStockLocationsUseCase } from './application/use-cases/get-stock-locations.use-case';
import { GetInventoryUseCase } from './application/use-cases/get-inventory.use-case';
import { CreateStockMoveUseCase } from './application/use-cases/create-stock-move.use-case';
import { ValidateStockMoveUseCase } from './application/use-cases/validate-stock-move.use-case';

@Module({
    imports: [
        TypeOrmModule.forFeature([Warehouse, StockLocation, StockMove, StockQuant]),
    ],
    controllers: [InventoryController],
    providers: [
        InventoryService,
        { provide: 'IWarehouseRepository', useClass: TypeOrmWarehouseRepository },
        { provide: 'IStockLocationRepository', useClass: TypeOrmStockLocationRepository },
        { provide: 'IStockMoveRepository', useClass: TypeOrmStockMoveRepository },
        { provide: 'IStockQuantRepository', useClass: TypeOrmStockQuantRepository },
        CreateWarehouseUseCase,
        GetWarehousesUseCase,
        CreateStockLocationUseCase,
        GetStockLocationsUseCase,
        GetInventoryUseCase,
        CreateStockMoveUseCase,
        ValidateStockMoveUseCase,
    ],
    exports: [
        InventoryService,
        'IWarehouseRepository',
        'IStockLocationRepository',
        'IStockMoveRepository',
        'IStockQuantRepository',
    ],
})
export class InventoryModule { }

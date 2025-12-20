import { Test, TestingModule } from '@nestjs/testing';
import { InventoryController } from './inventory.controller';
import { CreateWarehouseUseCase } from '../application/use-cases/create-warehouse.use-case';
import { GetWarehousesUseCase } from '../application/use-cases/get-warehouses.use-case';
import { CreateStockLocationUseCase } from '../application/use-cases/create-stock-location.use-case';
import { GetStockLocationsUseCase } from '../application/use-cases/get-stock-locations.use-case';
import { GetInventoryUseCase } from '../application/use-cases/get-inventory.use-case';
import { ValidateStockMoveUseCase } from '../application/use-cases/validate-stock-move.use-case';

describe('InventoryController', () => {
    let controller: InventoryController;
    let createWarehouseUseCase: jest.Mocked<CreateWarehouseUseCase>;
    let getWarehousesUseCase: jest.Mocked<GetWarehousesUseCase>;
    let createLocationUseCase: jest.Mocked<CreateStockLocationUseCase>;
    let getLocationsUseCase: jest.Mocked<GetStockLocationsUseCase>;
    let getInventoryUseCase: jest.Mocked<GetInventoryUseCase>;
    let validateStockMoveUseCase: jest.Mocked<ValidateStockMoveUseCase>;

    const mockRequest = { user: { companyId: 'company-1', id: 'user-1' } };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [InventoryController],
            providers: [
                { provide: CreateWarehouseUseCase, useValue: { execute: jest.fn() } },
                { provide: GetWarehousesUseCase, useValue: { execute: jest.fn() } },
                { provide: CreateStockLocationUseCase, useValue: { execute: jest.fn() } },
                { provide: GetStockLocationsUseCase, useValue: { execute: jest.fn() } },
                { provide: GetInventoryUseCase, useValue: { execute: jest.fn() } },
                { provide: ValidateStockMoveUseCase, useValue: { execute: jest.fn() } },
            ],
        }).compile();

        controller = module.get<InventoryController>(InventoryController);
        createWarehouseUseCase = module.get(CreateWarehouseUseCase);
        getWarehousesUseCase = module.get(GetWarehousesUseCase);
        createLocationUseCase = module.get(CreateStockLocationUseCase);
        getLocationsUseCase = module.get(GetStockLocationsUseCase);
        getInventoryUseCase = module.get(GetInventoryUseCase);
        validateStockMoveUseCase = module.get(ValidateStockMoveUseCase);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('createWarehouse', () => {
        it('should create a warehouse', async () => {
            const dto = { name: 'Main Warehouse', code: 'WH001' };
            const expected = { id: '1', ...dto };
            createWarehouseUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.createWarehouse(dto as any, mockRequest);

            expect(createWarehouseUseCase.execute).toHaveBeenCalledWith('company-1', dto, 'user-1');
            expect(result).toEqual(expected);
        });
    });

    describe('findAllWarehouses', () => {
        it('should return all warehouses', async () => {
            const expected = [{ id: '1', name: 'Main Warehouse' }];
            getWarehousesUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.findAllWarehouses(mockRequest);

            expect(getWarehousesUseCase.execute).toHaveBeenCalledWith('company-1');
            expect(result).toEqual(expected);
        });
    });

    describe('createLocation', () => {
        it('should create a stock location', async () => {
            const dto = { name: 'Shelf A', warehouseId: 'wh-1', usage: 'internal' as const };
            const expected = { id: '1', ...dto };
            createLocationUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.createLocation(dto as any, mockRequest);

            expect(createLocationUseCase.execute).toHaveBeenCalledWith('company-1', dto, 'user-1');
            expect(result).toEqual(expected);
        });
    });

    describe('findAllLocations', () => {
        it('should return all locations', async () => {
            const expected = [{ id: '1', name: 'Shelf A' }];
            getLocationsUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.findAllLocations(mockRequest);

            expect(getLocationsUseCase.execute).toHaveBeenCalledWith('company-1');
            expect(result).toEqual(expected);
        });
    });

    describe('getInventory', () => {
        it('should return inventory levels', async () => {
            const expected = [{ productId: 'prod-1', locationId: 'loc-1', quantity: 100 }];
            getInventoryUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.getInventory(mockRequest);

            expect(getInventoryUseCase.execute).toHaveBeenCalledWith('company-1');
            expect(result).toEqual(expected);
        });
    });

    describe('validateMove', () => {
        it('should validate a stock move', async () => {
            const expected = { id: '1', state: 'done' };
            validateStockMoveUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.validateMove('1', mockRequest);

            expect(validateStockMoveUseCase.execute).toHaveBeenCalledWith('company-1', '1', 'user-1');
            expect(result).toEqual(expected);
        });
    });
});

import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { CreateWarehouseUseCase } from '../application/use-cases/create-warehouse.use-case';
import { GetWarehousesUseCase } from '../application/use-cases/get-warehouses.use-case';
import { CreateStockLocationUseCase } from '../application/use-cases/create-stock-location.use-case';
import { GetStockLocationsUseCase } from '../application/use-cases/get-stock-locations.use-case';
import { GetInventoryUseCase } from '../application/use-cases/get-inventory.use-case';
import { CreateStockMoveUseCase } from '../application/use-cases/create-stock-move.use-case';
import { ValidateStockMoveUseCase } from '../application/use-cases/validate-stock-move.use-case';
import { CreateWarehouseDto } from '../dto/create-warehouse.dto';
import { CreateStockLocationDto } from '../dto/create-stock-location.dto';

describe('InventoryService', () => {
    let service: InventoryService;
    let createWarehouseUseCase: jest.Mocked<CreateWarehouseUseCase>;
    let getWarehousesUseCase: jest.Mocked<GetWarehousesUseCase>;
    let createLocationUseCase: jest.Mocked<CreateStockLocationUseCase>;
    let getLocationsUseCase: jest.Mocked<GetStockLocationsUseCase>;
    let getInventoryUseCase: jest.Mocked<GetInventoryUseCase>;
    let createStockMoveUseCase: jest.Mocked<CreateStockMoveUseCase>;
    let validateStockMoveUseCase: jest.Mocked<ValidateStockMoveUseCase>;

    const mockWarehouse = { id: 'wh-1', name: 'Main Warehouse', companyId: 'company-1' };
    const mockLocation = { id: 'loc-1', name: 'Location A', warehouseId: 'wh-1' };
    const mockInventory = { productId: 'prod-1', quantity: 100 };
    const mockStockMove = { id: 'move-1', productId: 'prod-1', quantity: 10, state: 'draft' };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InventoryService,
                {
                    provide: CreateWarehouseUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: GetWarehousesUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: CreateStockLocationUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: GetStockLocationsUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: GetInventoryUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: CreateStockMoveUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: ValidateStockMoveUseCase,
                    useValue: { execute: jest.fn() },
                },
            ],
        }).compile();

        service = module.get<InventoryService>(InventoryService);
        createWarehouseUseCase = module.get(CreateWarehouseUseCase);
        getWarehousesUseCase = module.get(GetWarehousesUseCase);
        createLocationUseCase = module.get(CreateStockLocationUseCase);
        getLocationsUseCase = module.get(GetStockLocationsUseCase);
        getInventoryUseCase = module.get(GetInventoryUseCase);
        createStockMoveUseCase = module.get(CreateStockMoveUseCase);
        validateStockMoveUseCase = module.get(ValidateStockMoveUseCase);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createWarehouse', () => {
        it('should delegate to CreateWarehouseUseCase', async () => {
            const dto: CreateWarehouseDto = { name: 'New Warehouse' } as CreateWarehouseDto;
            createWarehouseUseCase.execute.mockResolvedValue(mockWarehouse as any);

            const result = await service.createWarehouse(dto, 'company-1', 'user-1');

            expect(createWarehouseUseCase.execute).toHaveBeenCalledWith('company-1', dto, 'user-1');
            expect(result).toEqual(mockWarehouse);
        });
    });

    describe('findAllWarehouses', () => {
        it('should delegate to GetWarehousesUseCase', async () => {
            const warehouses = [mockWarehouse];
            getWarehousesUseCase.execute.mockResolvedValue(warehouses as any);

            const result = await service.findAllWarehouses('company-1');

            expect(getWarehousesUseCase.execute).toHaveBeenCalledWith('company-1');
            expect(result).toEqual(warehouses);
        });
    });

    describe('createLocation', () => {
        it('should delegate to CreateStockLocationUseCase', async () => {
            const dto: CreateStockLocationDto = { name: 'New Location', warehouseId: 'wh-1', usage: 'internal' } as CreateStockLocationDto;
            createLocationUseCase.execute.mockResolvedValue(mockLocation as any);

            const result = await service.createLocation(dto, 'company-1', 'user-1');

            expect(createLocationUseCase.execute).toHaveBeenCalledWith('company-1', dto, 'user-1');
            expect(result).toEqual(mockLocation);
        });
    });

    describe('findAllLocations', () => {
        it('should delegate to GetStockLocationsUseCase', async () => {
            const locations = [mockLocation];
            getLocationsUseCase.execute.mockResolvedValue(locations as any);

            const result = await service.findAllLocations('company-1');

            expect(getLocationsUseCase.execute).toHaveBeenCalledWith('company-1');
            expect(result).toEqual(locations);
        });
    });

    describe('getInventory', () => {
        it('should delegate to GetInventoryUseCase with productId', async () => {
            const inventory = [mockInventory];
            getInventoryUseCase.execute.mockResolvedValue(inventory as any);

            const result = await service.getInventory('company-1', 'prod-1');

            expect(getInventoryUseCase.execute).toHaveBeenCalledWith('company-1', 'prod-1');
            expect(result).toEqual(inventory);
        });

        it('should delegate to GetInventoryUseCase without productId', async () => {
            const inventory = [mockInventory];
            getInventoryUseCase.execute.mockResolvedValue(inventory as any);

            const result = await service.getInventory('company-1');

            expect(getInventoryUseCase.execute).toHaveBeenCalledWith('company-1', undefined);
            expect(result).toEqual(inventory);
        });
    });

    describe('createStockMove', () => {
        it('should delegate to CreateStockMoveUseCase', async () => {
            const data = { productId: 'prod-1', quantity: 10 };
            createStockMoveUseCase.execute.mockResolvedValue(mockStockMove as any);

            const result = await service.createStockMove('company-1', data, 'user-1');

            expect(createStockMoveUseCase.execute).toHaveBeenCalledWith('company-1', data, 'user-1', undefined);
            expect(result).toEqual(mockStockMove);
        });
    });

    describe('validateStockMove', () => {
        it('should delegate to ValidateStockMoveUseCase', async () => {
            validateStockMoveUseCase.execute.mockResolvedValue({ ...mockStockMove, state: 'done' } as any);

            const result = await service.validateStockMove('company-1', 'move-1', 'user-1');

            expect(validateStockMoveUseCase.execute).toHaveBeenCalledWith('company-1', 'move-1', 'user-1');
            expect((result as any).state).toBe('done');
        });
    });

    describe('getInternalLocationForWarehouse', () => {
        it('should return internal location when found', async () => {
            const internalLocation = { id: 'loc-1', name: 'Internal', usage: 'internal', warehouseId: 'wh-1' };
            (getLocationsUseCase as any).getInternalByWarehouse = jest.fn().mockResolvedValue(internalLocation);

            const result = await service.getInternalLocationForWarehouse('wh-1', 'company-1');

            expect(getLocationsUseCase.getInternalByWarehouse).toHaveBeenCalledWith('wh-1', 'company-1');
            expect(result).toEqual(internalLocation);
        });

        it('should throw NotFoundException when no internal location found', async () => {
            (getLocationsUseCase as any).getInternalByWarehouse = jest.fn().mockResolvedValue(null);

            await expect(service.getInternalLocationForWarehouse('wh-1', 'company-1'))
                .rejects.toThrow('No internal stock location found for warehouse wh-1');
        });
    });

    describe('createStockMove with EntityManager', () => {
        it('should pass EntityManager to use case when provided', async () => {
            const data = { productId: 'prod-1', quantity: 10 };
            const mockManager = {} as any;
            createStockMoveUseCase.execute.mockResolvedValue(mockStockMove as any);

            const result = await service.createStockMove('company-1', data, 'user-1', mockManager);

            expect(createStockMoveUseCase.execute).toHaveBeenCalledWith('company-1', data, 'user-1', mockManager);
            expect(result).toEqual(mockStockMove);
        });
    });
});

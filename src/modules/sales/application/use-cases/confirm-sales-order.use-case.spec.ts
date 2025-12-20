import { Test, TestingModule } from '@nestjs/testing';
import { ConfirmSalesOrderUseCase } from './confirm-sales-order.use-case';
import { ISalesOrderRepository } from '../../domain/repositories/sales-order.repository.interface';
import { InventoryService } from '@modules/inventory/services/inventory.service';
import { DataSource, QueryRunner } from 'typeorm';
import { SalesOrder } from '../../domain/entities/sales-order.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ConfirmSalesOrderUseCase', () => {
    let useCase: ConfirmSalesOrderUseCase;
    let repository: jest.Mocked<ISalesOrderRepository>;
    let inventoryService: jest.Mocked<InventoryService>;
    let dataSource: jest.Mocked<DataSource>;
    let queryRunner: jest.Mocked<QueryRunner>;

    const mockOrder = {
        id: 'order-1',
        companyId: 'company-1',
        state: 'draft',
        lines: [
            { productId: 'prod-1', quantity: 10 },
            { productId: 'prod-2', quantity: 5 },
        ],
    } as SalesOrder;

    const mockLocations = [
        { id: 'loc-1', usage: 'internal' },
    ];

    beforeEach(async () => {
        // Mock QueryRunner and DataSource transaction
        queryRunner = {
            connect: jest.fn(),
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            rollbackTransaction: jest.fn(),
            release: jest.fn(),
            manager: {},
        } as any;

        dataSource = {
            transaction: jest.fn((cb) => cb(queryRunner.manager)),
        } as any;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ConfirmSalesOrderUseCase,
                {
                    provide: 'ISalesOrderRepository',
                    useValue: {
                        findOneByCompanyWithRelations: jest.fn(),
                        save: jest.fn(),
                        withTransaction: jest.fn().mockReturnThis(), // Returns self (mocked repo)
                    },
                },
                {
                    provide: InventoryService,
                    useValue: {
                        findAllLocations: jest.fn(),
                        createStockMove: jest.fn(),
                    },
                },
                {
                    provide: DataSource,
                    useValue: dataSource,
                },
            ],
        }).compile();

        useCase = module.get<ConfirmSalesOrderUseCase>(ConfirmSalesOrderUseCase);
        repository = module.get('ISalesOrderRepository');
        inventoryService = module.get(InventoryService);
    });

    it('should confirm order and create stock moves within a transaction (fallback path)', async () => {
        repository.findOneByCompanyWithRelations.mockResolvedValue(mockOrder);
        inventoryService.findAllLocations.mockResolvedValue(mockLocations as any);
        repository.save.mockResolvedValue({ ...mockOrder, state: 'confirmed' } as any);

        const result = await useCase.execute('company-1', 'order-1', 'user-1');

        // Verify Transaction Usage
        expect(dataSource.transaction).toHaveBeenCalled();
        expect(repository.withTransaction).toHaveBeenCalledWith(queryRunner.manager);

        // Verify Business Logic
        expect(inventoryService.createStockMove).toHaveBeenCalledTimes(2);
        expect(inventoryService.createStockMove).toHaveBeenCalledWith(
            'company-1',
            expect.objectContaining({ productId: 'prod-1' }),
            'user-1',
            queryRunner.manager
        );

        expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({ state: 'confirmed' }));
        expect(result.state).toBe('confirmed');
    });

    it('should use warehouse-specific location when order has warehouseId', async () => {
        const orderWithWarehouse = { ...mockOrder, warehouseId: 'wh-1', state: 'draft' } as SalesOrder;
        const warehouseLocation = { id: 'loc-wh1', usage: 'internal', warehouseId: 'wh-1' };

        repository.findOneByCompanyWithRelations.mockResolvedValue(orderWithWarehouse);
        (inventoryService as any).getInternalLocationForWarehouse = jest.fn().mockResolvedValue(warehouseLocation);
        repository.save.mockResolvedValue({ ...orderWithWarehouse, state: 'confirmed' } as any);

        await useCase.execute('company-1', 'order-1', 'user-1');

        expect(inventoryService.getInternalLocationForWarehouse).toHaveBeenCalledWith('wh-1', 'company-1');
        expect(inventoryService.createStockMove).toHaveBeenCalledWith(
            'company-1',
            expect.objectContaining({ sourceLocationId: 'loc-wh1' }),
            'user-1',
            queryRunner.manager
        );
    });

    it('should throw NotFoundException if order not found', async () => {
        repository.findOneByCompanyWithRelations.mockResolvedValue(null);

        await expect(useCase.execute('company-1', 'order-1', 'user-1'))
            .rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if order is not in draft state', async () => {
        const confirmedOrder = { ...mockOrder, state: 'confirmed' } as SalesOrder;
        repository.findOneByCompanyWithRelations.mockResolvedValue(confirmedOrder);

        await expect(useCase.execute('company-1', 'order-1', 'user-1'))
            .rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if no internal location found (fallback path)', async () => {
        repository.findOneByCompanyWithRelations.mockResolvedValue(mockOrder);
        inventoryService.findAllLocations.mockResolvedValue([]); // No locations

        await expect(useCase.execute('company-1', 'order-1', 'user-1'))
            .rejects.toThrow(BadRequestException);
    });
});

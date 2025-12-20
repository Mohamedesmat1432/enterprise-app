import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { CreateProductUseCase } from '../application/use-cases/create-product.use-case';
import { GetProductsUseCase } from '../application/use-cases/get-products.use-case';
import { GetProductUseCase } from '../application/use-cases/get-product.use-case';
import { UpdateProductUseCase } from '../application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from '../application/use-cases/delete-product.use-case';

describe('ProductsController', () => {
    let controller: ProductsController;
    let createProductUseCase: jest.Mocked<CreateProductUseCase>;
    let getProductsUseCase: jest.Mocked<GetProductsUseCase>;
    let getProductUseCase: jest.Mocked<GetProductUseCase>;
    let updateProductUseCase: jest.Mocked<UpdateProductUseCase>;
    let deleteProductUseCase: jest.Mocked<DeleteProductUseCase>;

    const mockRequest = { user: { companyId: 'company-1', id: 'user-1' } };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductsController],
            providers: [
                { provide: CreateProductUseCase, useValue: { execute: jest.fn() } },
                { provide: GetProductsUseCase, useValue: { execute: jest.fn() } },
                { provide: GetProductUseCase, useValue: { execute: jest.fn() } },
                { provide: UpdateProductUseCase, useValue: { execute: jest.fn() } },
                { provide: DeleteProductUseCase, useValue: { execute: jest.fn() } },
            ],
        }).compile();

        controller = module.get<ProductsController>(ProductsController);
        createProductUseCase = module.get(CreateProductUseCase);
        getProductsUseCase = module.get(GetProductsUseCase);
        getProductUseCase = module.get(GetProductUseCase);
        updateProductUseCase = module.get(UpdateProductUseCase);
        deleteProductUseCase = module.get(DeleteProductUseCase);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a product', async () => {
            const dto = { name: 'Product A', sku: 'SKU001', price: 100, productType: 'stockable' as const, uomId: 'uom-1' };
            const expected = { id: '1', ...dto };
            createProductUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.create(dto, mockRequest);

            expect(createProductUseCase.execute).toHaveBeenCalledWith('company-1', dto, 'user-1');
            expect(result).toEqual(expected);
        });
    });

    describe('findAll', () => {
        it('should return paginated products', async () => {
            const query = { page: 1, limit: 10 };
            const expected = { items: [{ id: '1', name: 'Product A' }], total: 1 };
            getProductsUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.findAll(query, mockRequest);

            expect(getProductsUseCase.execute).toHaveBeenCalledWith('company-1', query);
            expect(result).toEqual(expected);
        });
    });

    describe('findOne', () => {
        it('should return a product by id', async () => {
            const expected = { id: '1', name: 'Product A' };
            getProductUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.findOne('1', mockRequest);

            expect(getProductUseCase.execute).toHaveBeenCalledWith('company-1', '1');
            expect(result).toEqual(expected);
        });
    });

    describe('update', () => {
        it('should update a product', async () => {
            const dto = { name: 'Updated Product' };
            const expected = { id: '1', ...dto };
            updateProductUseCase.execute.mockResolvedValue(expected as any);

            const result = await controller.update('1', dto, mockRequest);

            expect(updateProductUseCase.execute).toHaveBeenCalledWith('company-1', '1', dto, 'user-1');
            expect(result).toEqual(expected);
        });
    });

    describe('remove', () => {
        it('should delete a product', async () => {
            deleteProductUseCase.execute.mockResolvedValue({ message: 'Product deleted' } as any);

            await controller.remove('1', mockRequest);

            expect(deleteProductUseCase.execute).toHaveBeenCalledWith('company-1', '1');
        });
    });
});

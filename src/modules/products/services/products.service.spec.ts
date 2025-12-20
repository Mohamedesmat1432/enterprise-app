import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { CreateProductUseCase } from '../application/use-cases/create-product.use-case';
import { GetProductsUseCase } from '../application/use-cases/get-products.use-case';
import { GetProductUseCase } from '../application/use-cases/get-product.use-case';
import { UpdateProductUseCase } from '../application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from '../application/use-cases/delete-product.use-case';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductQueryDto } from '../dto/product-query.dto';

describe('ProductsService', () => {
    let service: ProductsService;
    let createUseCase: jest.Mocked<CreateProductUseCase>;
    let getProductsUseCase: jest.Mocked<GetProductsUseCase>;
    let getProductUseCase: jest.Mocked<GetProductUseCase>;
    let updateUseCase: jest.Mocked<UpdateProductUseCase>;
    let deleteUseCase: jest.Mocked<DeleteProductUseCase>;

    const mockProduct = { id: 'prod-1', name: 'Test Product', companyId: 'company-1' };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsService,
                {
                    provide: CreateProductUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: GetProductsUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: GetProductUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: UpdateProductUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: DeleteProductUseCase,
                    useValue: { execute: jest.fn() },
                },
            ],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
        createUseCase = module.get(CreateProductUseCase);
        getProductsUseCase = module.get(GetProductsUseCase);
        getProductUseCase = module.get(GetProductUseCase);
        updateUseCase = module.get(UpdateProductUseCase);
        deleteUseCase = module.get(DeleteProductUseCase);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should delegate to CreateProductUseCase', async () => {
            const dto: CreateProductDto = { name: 'New Product', productType: 'stockable', uomId: 'uom-1' } as CreateProductDto;
            createUseCase.execute.mockResolvedValue(mockProduct as any);

            const result = await service.create(dto, 'company-1', 'user-1');

            expect(createUseCase.execute).toHaveBeenCalledWith('company-1', dto, 'user-1');
            expect(result).toEqual(mockProduct);
        });
    });

    describe('findAll', () => {
        it('should delegate to GetProductsUseCase', async () => {
            const query: ProductQueryDto = { page: 1, limit: 10 };
            const products = [mockProduct];
            getProductsUseCase.execute.mockResolvedValue(products as any);

            const result = await service.findAll(query, 'company-1');

            expect(getProductsUseCase.execute).toHaveBeenCalledWith('company-1', query);
            expect(result).toEqual(products);
        });
    });

    describe('findOne', () => {
        it('should delegate to GetProductUseCase', async () => {
            getProductUseCase.execute.mockResolvedValue(mockProduct as any);

            const result = await service.findOne('prod-1', 'company-1');

            expect(getProductUseCase.execute).toHaveBeenCalledWith('company-1', 'prod-1');
            expect(result).toEqual(mockProduct);
        });
    });

    describe('update', () => {
        it('should delegate to UpdateProductUseCase', async () => {
            const dto: UpdateProductDto = { name: 'Updated Product' } as UpdateProductDto;
            updateUseCase.execute.mockResolvedValue({ ...mockProduct, ...dto } as any);

            const result = await service.update('prod-1', dto, 'company-1', 'user-1');

            expect(updateUseCase.execute).toHaveBeenCalledWith('company-1', 'prod-1', dto, 'user-1');
            expect(result.name).toBe('Updated Product');
        });
    });

    describe('remove', () => {
        it('should delegate to DeleteProductUseCase', async () => {
            deleteUseCase.execute.mockResolvedValue(undefined);

            await service.remove('prod-1', 'company-1');

            expect(deleteUseCase.execute).toHaveBeenCalledWith('company-1', 'prod-1');
        });
    });
});

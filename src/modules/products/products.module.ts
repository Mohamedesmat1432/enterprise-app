import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './domain/entities/product.entity';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';
import { TypeOrmProductRepository } from './infrastructure/persistence/typeorm-product.repository';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { GetProductsUseCase } from './application/use-cases/get-products.use-case';
import { GetProductUseCase } from './application/use-cases/get-product.use-case';
import { UpdateProductUseCase } from './application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from './application/use-cases/delete-product.use-case';

@Module({
    imports: [TypeOrmModule.forFeature([Product])],
    controllers: [ProductsController],
    providers: [
        ProductsService,
        { provide: 'IProductRepository', useClass: TypeOrmProductRepository },
        CreateProductUseCase,
        GetProductsUseCase,
        GetProductUseCase,
        UpdateProductUseCase,
        DeleteProductUseCase,
    ],
    exports: [
        ProductsService,
        'IProductRepository',
    ],
})
export class ProductsModule { }

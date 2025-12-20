import { Injectable } from '@nestjs/common';
import { CreateProductUseCase } from '../application/use-cases/create-product.use-case';
import { GetProductsUseCase } from '../application/use-cases/get-products.use-case';
import { GetProductUseCase } from '../application/use-cases/get-product.use-case';
import { UpdateProductUseCase } from '../application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from '../application/use-cases/delete-product.use-case';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductQueryDto } from '../dto/product-query.dto';

@Injectable()
export class ProductsService {
    constructor(
        private readonly createUseCase: CreateProductUseCase,
        private readonly getProductsUseCase: GetProductsUseCase,
        private readonly getProductUseCase: GetProductUseCase,
        private readonly updateUseCase: UpdateProductUseCase,
        private readonly deleteUseCase: DeleteProductUseCase,
    ) { }

    async create(createProductDto: CreateProductDto, companyId: string, userId: string) {
        return this.createUseCase.execute(companyId, createProductDto, userId);
    }

    async findAll(query: ProductQueryDto, companyId: string) {
        return this.getProductsUseCase.execute(companyId, query);
    }

    async findOne(id: string, companyId: string) {
        return this.getProductUseCase.execute(companyId, id);
    }

    async update(id: string, updateProductDto: UpdateProductDto, companyId: string, userId: string) {
        return this.updateUseCase.execute(companyId, id, updateProductDto, userId);
    }

    async remove(id: string, companyId: string) {
        return this.deleteUseCase.execute(companyId, id);
    }
}

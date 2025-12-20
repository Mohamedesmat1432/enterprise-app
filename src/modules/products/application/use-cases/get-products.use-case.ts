import { Injectable, Inject } from '@nestjs/common';
import type { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { ProductQueryDto } from '../../dto/product-query.dto';
import { createPaginatedResponse } from '@common/index';

@Injectable()
export class GetProductsUseCase {
    constructor(
        @Inject('IProductRepository')
        private readonly productRepository: IProductRepository,
    ) { }

    async execute(companyId: string, query: ProductQueryDto) {
        const { items, total } = await this.productRepository.findAllWithFilters(companyId, query);
        return createPaginatedResponse(items, total, query.page || 1, query.limit || 10);
    }
}

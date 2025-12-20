import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { Product } from '../../domain/entities/product.entity';

@Injectable()
export class GetProductUseCase {
    constructor(
        @Inject('IProductRepository')
        private readonly productRepository: IProductRepository,
    ) { }

    async execute(companyId: string, id: string): Promise<Product> {
        const product = await this.productRepository.findByIdAndTenant(id, companyId, ['uom', 'purchaseUom']);
        if (!product) {
            throw new NotFoundException(`Product with ID "${id}" not found`);
        }
        return product;
    }
}

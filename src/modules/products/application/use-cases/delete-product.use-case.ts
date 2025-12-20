import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IProductRepository } from '../../domain/repositories/product.repository.interface';

@Injectable()
export class DeleteProductUseCase {
    constructor(
        @Inject('IProductRepository')
        private readonly productRepository: IProductRepository,
    ) { }

    async execute(companyId: string, id: string): Promise<void> {
        const product = await this.productRepository.findByIdAndTenant(id, companyId);
        if (!product) {
            throw new NotFoundException(`Product with ID "${id}" not found`);
        }
        await this.productRepository.softDelete(id);
    }
}

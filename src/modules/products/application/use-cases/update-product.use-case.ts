import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { Product } from '../../domain/entities/product.entity';
import { UpdateProductDto } from '../../dto/update-product.dto';

@Injectable()
export class UpdateProductUseCase {
    constructor(
        @Inject('IProductRepository')
        private readonly productRepository: IProductRepository,
    ) { }

    async execute(companyId: string, id: string, dto: UpdateProductDto, userId: string): Promise<Product> {
        const product = await this.productRepository.findByIdAndTenant(id, companyId);
        if (!product) {
            throw new NotFoundException(`Product with ID "${id}" not found`);
        }

        Object.assign(product, {
            ...dto,
            updatedBy: userId,
        });

        return await this.productRepository.save(product);
    }
}

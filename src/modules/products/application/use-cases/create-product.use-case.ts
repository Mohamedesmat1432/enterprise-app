import { Injectable, Inject } from '@nestjs/common';
import type { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { Product } from '../../domain/entities/product.entity';
import { CreateProductDto } from '../../dto/create-product.dto';

@Injectable()
export class CreateProductUseCase {
    constructor(
        @Inject('IProductRepository')
        private readonly productRepository: IProductRepository,
    ) { }

    async execute(companyId: string, dto: CreateProductDto, userId: string): Promise<Product> {
        const productData = {
            ...dto,
            companyId,
            createdBy: userId,
        };
        return await this.productRepository.create(productData);
    }
}

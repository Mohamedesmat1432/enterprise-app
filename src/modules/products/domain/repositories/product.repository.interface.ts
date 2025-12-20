import { Product } from '../entities/product.entity';
import { ITenantRepository } from '@core/domain/repositories/base-repository.interface';
import { ProductQueryDto } from '../../dto/product-query.dto';

export interface IProductRepository extends ITenantRepository<Product> {
    findAllWithFilters(companyId: string, query: ProductQueryDto): Promise<{ items: Product[]; total: number }>;
}

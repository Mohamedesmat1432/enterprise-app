import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../domain/entities/product.entity';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { BaseTenantTypeOrmRepository } from '@core/infrastructure/persistence/base-typeorm.repository';
import { ProductQueryDto } from '../../dto/product-query.dto';

@Injectable()
export class TypeOrmProductRepository
    extends BaseTenantTypeOrmRepository<Product>
    implements IProductRepository {
    constructor(
        @InjectRepository(Product)
        repository: Repository<Product>,
    ) {
        super(repository);
    }

    async findAllWithFilters(companyId: string, query: ProductQueryDto): Promise<{ items: Product[]; total: number }> {
        const {
            page = 1,
            limit = 10,
            search,
            productType,
            sortBy = 'name',
            sortOrder = 'ASC',
        } = query;

        const qb = this.repository.createQueryBuilder('product');
        qb.leftJoinAndSelect('product.uom', 'uom')
            .leftJoinAndSelect('product.purchaseUom', 'purchaseUom')
            .where('product.company_id = :companyId', { companyId });

        if (search) {
            qb.andWhere(
                '(product.name ILIKE :search OR product.sku ILIKE :search OR product.barcode ILIKE :search)',
                { search: `%${search}%` },
            );
        }

        if (productType) {
            qb.andWhere('product.productType = :productType', { productType });
        }

        if (sortBy) {
            qb.orderBy(`product.${sortBy}`, sortOrder as any);
        }

        qb.skip((page - 1) * limit).take(limit);

        const [items, total] = await qb.getManyAndCount();
        return { items, total };
    }
}

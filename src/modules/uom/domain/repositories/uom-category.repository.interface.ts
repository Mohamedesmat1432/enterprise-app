import { ITenantRepository } from '@core/domain/repositories/base-repository.interface';
import { UomCategory } from '../entities/uom-category.entity';
import { UomCategoryQueryDto } from '../../dto/uom-category-query.dto';

export interface IUomCategoryRepository extends ITenantRepository<UomCategory> {
    findAllPaginated(query: UomCategoryQueryDto, companyId: string): Promise<any>;
    findByName(name: string, companyId: string): Promise<UomCategory | null>;
}

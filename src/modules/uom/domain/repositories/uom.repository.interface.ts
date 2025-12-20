import { ITenantRepository } from '@core/domain/repositories/base-repository.interface';
import { Uom } from '../entities/uom.entity';
import { UomQueryDto } from '../../dto/uom-query.dto';

export interface IUomRepository extends ITenantRepository<Uom> {
    findByCategory(categoryId: string, companyId: string): Promise<Uom[]>;
    findReferenceUom(categoryId: string, companyId: string): Promise<Uom | null>;
    findAllPaginated(query: UomQueryDto, companyId: string): Promise<any>;
}

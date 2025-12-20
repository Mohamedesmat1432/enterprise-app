import { ITenantRepository } from '@core/domain/repositories/base-repository.interface';
import { TaxQueryDto } from '@modules/taxes/dto/tax-query.dto';
import { Tax } from '@modules/taxes/domain/entities/tax.entity';

export interface ITaxRepository extends ITenantRepository<Tax> {
    findAllPaginated(query: TaxQueryDto, companyId: string): Promise<any>;
    findActiveSalesTaxes(companyId: string): Promise<Tax[]>;
    findActivePurchaseTaxes(companyId: string): Promise<Tax[]>;
}

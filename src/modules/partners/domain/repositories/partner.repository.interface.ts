
import { Partner } from '../entities/partner.entity';
import { ITenantRepository } from '@core/domain/repositories/base-repository.interface';
import { PartnerQueryDto } from '../../dto/partner-query.dto';

export interface IPartnerRepository extends ITenantRepository<Partner> {
    findAllWithFilters(companyId: string, query: PartnerQueryDto): Promise<{ items: Partner[]; total: number }>;
}

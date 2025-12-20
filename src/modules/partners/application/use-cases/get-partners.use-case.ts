
import { Injectable, Inject } from '@nestjs/common';
import type { IPartnerRepository } from '../../domain/repositories/partner.repository.interface';
import { Partner } from '../../domain/entities/partner.entity';
import { PartnerQueryDto } from '../../dto/partner-query.dto';
import { createPaginatedResponse } from '@common/index';

@Injectable()
export class GetPartnersUseCase {
    constructor(
        @Inject('IPartnerRepository')
        private readonly partnerRepo: IPartnerRepository,
    ) { }

    async execute(companyId: string, query: PartnerQueryDto) {
        const { items, total } = await this.partnerRepo.findAllWithFilters(companyId, query);
        return createPaginatedResponse(items, total, query.page || 1, query.limit || 10);
    }
}

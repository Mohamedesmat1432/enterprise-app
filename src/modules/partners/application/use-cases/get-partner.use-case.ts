
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IPartnerRepository } from '../../domain/repositories/partner.repository.interface';
import { Partner } from '../../domain/entities/partner.entity';

@Injectable()
export class GetPartnerUseCase {
    constructor(
        @Inject('IPartnerRepository')
        private readonly partnerRepo: IPartnerRepository,
    ) { }

    async execute(companyId: string, id: string): Promise<Partner> {
        const partner = await this.partnerRepo.findByIdAndTenant(id, companyId);
        if (!partner) {
            throw new NotFoundException(`Partner with ID "${id}" not found`);
        }
        return partner;
    }
}

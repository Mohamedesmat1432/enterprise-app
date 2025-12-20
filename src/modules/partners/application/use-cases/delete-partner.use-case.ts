
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IPartnerRepository } from '../../domain/repositories/partner.repository.interface';

@Injectable()
export class DeletePartnerUseCase {
    constructor(
        @Inject('IPartnerRepository')
        private readonly partnerRepo: IPartnerRepository,
    ) { }

    async execute(companyId: string, id: string): Promise<void> {
        // Since we are ensuring tenant isolation, we should probably check existence first or use softDelete with criteria?
        // BaseRepo likely has softDelete(id). It might NOT fail if not found or wrong tenant if not checked.
        // BaseTenantRepo usually doesn't have tenant-scoped delete method by default unless added.
        // Let's check existence first.

        const partner = await this.partnerRepo.findByIdAndTenant(id, companyId);
        if (!partner) {
            throw new NotFoundException(`Partner with ID "${id}" not found`);
        }
        await this.partnerRepo.softDelete(id);
    }
}
